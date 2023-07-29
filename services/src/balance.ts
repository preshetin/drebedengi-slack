import { ModalView } from "@slack/bolt";
import ddClient from "./ddClient";
import {
  GetBalanceResult,
  GetBalanceResultItem,
} from "./ts-ddng-client/src/messages/getBalance";

const NON_PERSONAL = "Non personal";

export async function balanceModalView(
  currentSlackUid: string
): Promise<ModalView> {
  const balances = await ddClient.getBalance({});
  const balancesFormattedList = buildBalancesList(balances, currentSlackUid);

  return {
    type: "modal",
    close: {
      type: "plain_text",
      text: "OK",
      emoji: true,
    },
    title: {
      type: "plain_text",
      text: "Баланс",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${balancesFormattedList} `,
        },
      },
    ],
  };
}

function buildBalancesList(
  balances: GetBalanceResult,
  currentSlackUid: string
): string {
  const slackUsers = calculateSlackUsers(balances, currentSlackUid);

  let result = "";
  for (const maybeSlackUser of slackUsers) {
    result +=
      maybeSlackUser[0] === "U" ? `<@${maybeSlackUser}>` : maybeSlackUser;
    result += ":\n";

    const balancesOfMaybeSlackUser = balances.filter(
      (balanceItem: GetBalanceResultItem) => {
        if (
          balanceItem.description &&
          balanceDescriptionHasSlackUid(balanceItem.description) &&
          balanceItem.description.includes(`{{${maybeSlackUser}}}`)
        ) {
          return true;
        }

        if (
          maybeSlackUser === NON_PERSONAL &&
          !balanceDescriptionHasSlackUid(balanceItem.description)
        ) {
          return true;
        }

        return false;
      }
    );

    for (const balanceItem of balancesOfMaybeSlackUser) {
      const formattedSum = (balanceItem.sum / 100).toLocaleString()
      result += getBalanceIndicator(balanceItem.sum);
      result += `${balanceItem.placeName}: ${formattedSum} ${
        balanceItem.currencyName
      }`;
      result += "\n\n";
    }
    result += "\n\n";
  }

  return result;
}

function balanceDescriptionHasSlackUid(description: string | null) {
  return (
    description && description.includes("{{") && description.includes("}}")
  );
}

function calculateSlackUsers(
  balances: GetBalanceResult,
  currentSlackUid: string
): string[] {
  let result: string[] = [];
  for (const balanceItem of balances) {
    if (
      balanceItem.description &&
      balanceDescriptionHasSlackUid(balanceItem.description)
    ) {
      // getting UID from string like foo{{U11111}}bar
      const slackUid = balanceItem.description.split("{{")[1].split("}}")[0];
      result.push(slackUid);
    } else {
      result.push(NON_PERSONAL);
    }
  }

  return Array.from(new Set(result))
    .sort()
    .reverse()
    .sort(function (x, y) {
      return x == currentSlackUid ? -1 : y == currentSlackUid ? 1 : 0;
    });
}

function getBalanceIndicator(sum: number): string {
  if (sum < 0) return ":red_circle: ";
  if (sum > 0) return ":large_green_circle: ";
  if (sum === 0) return ":white_circle: ";
  return "";
}
