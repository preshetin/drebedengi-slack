interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export default { message };

export function message(): MessageBlocks {
  return {
    text: "Привет, здесь вы можете внести остатки продуктов",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Внесите остатки продуктов:",
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
              text: ":carrot: Овощи",
              emoji: true,
            },
            action_id: "menu_leftovers_action_vegetables",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":green_apple: Фрукты",
              emoji: true,
            },
            action_id: "menu_leftovers_action_fruits",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":rice: Крупы",
              emoji: true,
            },
            action_id: "menu_leftovers_action_fruits1",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":canned_food: Консервы",
              emoji: true,
            },
            action_id: "menu_leftovers_action_fruits2",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":peanuts: Сухофрукты и орехи",
              emoji: true,
            },
            action_id: "menu_leftovers_action_fruits3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":package: Другое",
              emoji: true,
            },
            action_id: "menu_leftovers_action_fruits5",
          },
        ],
      },
    ],
  };
}
