import {
  AwsEvent,
  AwsCallback,
} from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import {WebClient} from "@slack/web-api";

export async function handler(
  event: AwsEvent,
  context: any,
  callback: AwsCallback
) {

  const slackUid = event.queryStringParameters ? event.queryStringParameters.user : null;

  const client = new WebClient(process.env.SLACK_BOT_TOKEN);

  const users = await client.users.list();

  let messageIsSent = false;
  if (typeof slackUid == 'string') {
    const message = remindMessage(slackUid);
    await client.chat.postMessage({ channel: slackUid, ...message });
    messageIsSent = true;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      messageIsSent,
      users: messageIsSent ? 'some users' : users,
      input: event,
    }),
  };
  return response;
}

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

function remindMessage(slackUid: string): MessageBlocks {
  return {
    text: `<@${slackUid}> просьба обновить данные в кошельках Дребеденег. Или подтвердите, что все актуально`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Привет, <@${slackUid}>. В Дребеденьгах за вами закреплены кошельки с ненулевым балансом: \n• Дана Сбербанк (Петр): 65 433.38 RUB \n• Дана (Петя): 100 000 RUB\n• Дана (Петя): 300 USD\n\n Если данные неактуальны, обновите их.\n\n `,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Если данные верны, нажмите на эту кнопку. ",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":white_check_mark: Данные верны",
            emoji: true,
          },
          action_id: "places_info_confirmed",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Или внесите операции:",
          emoji: true,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":moneybag: Внести доход",
              emoji: true,
            },
            action_id: "menu_action_income",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":money_with_wings: Внести расход",
              emoji: true,
            },
            action_id: "menu_action_expense",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":left_right_arrow: Перемещение",
              emoji: true,
            },
            action_id: "menu_action_move",
          },
        ],
      },
    ],
  };
}
