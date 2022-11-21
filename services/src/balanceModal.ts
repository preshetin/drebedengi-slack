import { WebClient } from "@slack/web-api";
import ddClient from "./ddClient";
import {
  GetBalanceResult,
} from "./ts-ddng-client/src/messages/getBalance";

export async function openBalanceModal(client: WebClient, triggerId: string) {
  const balances = await ddClient.getBalance({});
  const balancesFormattedList = buildBalancesList(balances);

  await client.views.open({
    trigger_id: triggerId,
    view: {
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
    },
  });
}

function buildBalancesList(balances: GetBalanceResult): string {
  let result = "";
  for (const balanceItem of balances) {
    result += "";
    result += `*${balanceItem.placeName}*: ${balanceItem.sum / 100} ${
      balanceItem.currencyName
    }`;
    result += "\n\n";
  }

  return result;
}
