import { SayFn } from "@slack/bolt";
import ddClient from "./ddClient";
import {
  GetBalanceParams,
  GetBalanceResult,
} from "./ts-ddng-client/src/messages/getBalance";

async function sayBalanceMessage(say: SayFn) {
  const balances = await ddClient.getBalance({});
  const balancesFormattedList = buildBalancesList(balances);

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Всем привет :wave:. Я пока только умею показывать баланс даны на данный момент. Вот он:\n${balancesFormattedList} `,
        },
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Чтобы получить баланс даны, упомяните меня в этом канале`,
          },
        ],
      },
    ],
    text: `Всем привет :wave:. Я пока только умею показывать баланс даны на данный момент. Вот он:`,
  });
}

export default sayBalanceMessage;

function buildBalancesList(balances: GetBalanceResult): string {
  let result = "";
  for (const balanceItem of balances) {
    result += "• ";
    result += `*${balanceItem.placeName}*: ${balanceItem.sum / 100} ${
      balanceItem.currencyName
    }`;
    result += "\n";
  }

  return result;
}
