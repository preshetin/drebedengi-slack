import {
  AwsEvent,
  AwsCallback,
} from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { WebClient } from "@slack/web-api";

export async function handler(
  event: AwsEvent,
  context: any,
  callback: AwsCallback
) {
  const slackUid = event.queryStringParameters
    ? event.queryStringParameters.user
    : null;

  const client = new WebClient(process.env.SLACK_BOT_TOKEN);

  const users = await client.users.list();

  let messageIsSent = false;
  if (typeof slackUid == "string") {
    const message = remindMessage(slackUid);
    await client.chat.postMessage({ channel: slackUid, ...message });
    messageIsSent = true;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      messageIsSent,
      users: messageIsSent ? "some users" : users,
      input: event,
    }),
  };
  return response;
}

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export function remindMessage(
  slackUid: string,
  initiatorSlackUid: string
): MessageBlocks {
  return {
    text: `Привет :wave: <@${slackUid}>. Просьба уточнить, актуальны ли данные в ваших кошельках:`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Привет :wave: <@${slackUid}>. Просьба уточнить, актуальны ли данные в ваших кошельках: \n• Дана Сбербанк (Петр): 65 433.38 RUB \n• Дана (Петя): 100 000 RUB\n• Дана (Петя): 300 USD\n\n Нажмите на одну из этих :point_down: кнопок`,
          verbatim: false,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "places_info_confirmed",
            value: JSON.stringify({ initiatorSlackUid }),
            style: "primary",
            text: {
              type: "plain_text",
              text: "Данные верны",
              emoji: true,
            },
          },
          {
            type: "button",
            action_id: "main_menu",
            text: {
              type: "plain_text",
              text: "Добавить операции",
              emoji: true,
            },
          },
        ],
      },
    ],
  };
}
