import { ExpenseFormResult } from "./expenseFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks: any[];
}

export async function expenseMessage(
  values: ExpenseFormResult,
  user: string
): Promise<MessageBlocks> {
  const sum = values.sum.sum.value;

  const category = values.categoryId.categoryId.selected_option.text.text;
  const currency = values.currencyId.currencyId.selected_option.text.text;
  const place = values.placeId.placeId.selected_option.text.text;

  const commentArr: string[] = [
    values.comment.comment.value,
    ...values.tags.tags.selected_options.map(
      (item) => `\`[${item.text.text}]\``
    ),
  ];
  const comment = commentArr.join(" ");

  const recordDate = values.recordDate.recordDate.selected_date
    ? values.recordDate.recordDate.selected_date
    : "сегодня";

  return {
    text: `Новая трата на сумму ${sum} ${currency} от <@${user}>,  категория ${category} `,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\`Новая Трата\`\n*Cумма:* ${sum} ${currency} \n *Категория:* ${category} \n *Комментарий:* ${comment} \n *Кошелек:* ${place} | добавил(а) <@${user}>  \n *Дата:* ${recordDate}  \n`,
        },
      },
    ],
  };
}
