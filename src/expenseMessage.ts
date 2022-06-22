import ddClient from "../ddClient";
import * as ddApi from "../ddApi";
import { ExpenseFormResult } from "./expenseFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks: any[];
}

export async function expenseMessage(
  values: ExpenseFormResult,
  user: string
): Promise<MessageBlocks> {
  const categories = await ddApi.getCategoryList();
  const currencies = await ddApi.getCurrencyList();
  const places = await ddApi.getPlaceList();

  const sum = values.sum.sum.value;
  const comment = values.comment.comment.value;

  const category = categories.find(
    (category: { id: string }) =>
      category.id === values.categoryId.categoryId.selected_option.value
  )!.name;
  const currency = currencies.find(
    (currency: { id: string }) =>
      currency.id === values.currencyId.currencyId.selected_option.value
  )!.code;
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
          text: `\`Новая Трата\`\n*Cумма:* ${sum} ${currency} \n *Категория:* ${category} \n *Комментарий:* ${comment} \n *Кошелек:* ${place} | добавил(а) <@${user}>  \n *Дата:* ${recordDate}  \n`,
        },
      },
    ],
  };
}
