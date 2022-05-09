import ddClient from "../ddClient";
import { ExpenseFormResult } from "./expenseFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks: any[];
}

export async function expenseMessage(
  values: ExpenseFormResult,
  user: string
): Promise<MessageBlocks> {
  const categories = await ddClient.getCategoryList();
  const currencies = await ddClient.getCurrencyList();
  const places = await ddClient.getPlaces();

  const sum = values.sum.sum.value;
  const comment = values.comment.comment.value;

  const category = categories.find((category: { id: string }) => category.id === values.categoryId.categoryId.selected_option.value)!.name;
  const currency = currencies.find((currency: {id: string}) => currency.id === values.currencyId.currencyId.selected_option.value)!.code;
  const place = places.find(
    (place) => place.id === +values.placeId.placeId.selected_option.value
  )!.name;

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
          text: `\`Новая Трата\`\n\n *Cумма:* ${sum} ${currency} \n *Категория:* ${category} \n *Комментарий:* ${comment} \n *Кошелек:* ${place} | добавил(а) <@${user}>  \n *Дата:* ${recordDate}  \n`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Посмотреть на сайте Дребеденег (drebedengi.ru)",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Открыть",
            emoji: true,
          },
          value: "url_click",
          url: "https://www.drebedengi.ru/?module=v2_homeBuhPrivate",
          action_id: "url_click",
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
            text:
              ":bulb: Чтобы внести трату, введите `/drebedengi-expense` строке чата и нажмите _Ввод_ / _Enter_. Или нажмите на плюсик под строкой чата и начните вводить _Внести расход_",
          },
        ],
      },
    ],
  };
}
