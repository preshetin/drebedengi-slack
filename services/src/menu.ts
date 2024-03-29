interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export default { message };

export function message(): MessageBlocks {
  return {
    text: "Привет, я помогаю работать с Дребеденьгами. Сейчас вы можете: посмотреть баланс, внести доход, внести расход, создать перемещение",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Сейчас вы можете:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":bar_chart: Посмотреть баланс",
              emoji: true,
            },
            action_id: "menu_action_balance",
          },
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
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":currency_exchange: Обмен валют",
              emoji: true,
            },
            action_id: "menu_action_exchange",
          },
        ],
      },
    ],
  };
}
