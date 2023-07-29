import { ExpenseFormResult } from "./expenseFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks: any[];
}

export async function expenseMessage(
  values: ExpenseFormResult,
  user: string
): Promise<MessageBlocks> {
  const sum = +values.sum.sum.value;
  const sumFormatted = sum.toLocaleString();

  const category = values.categoryId.categoryId.selected_option.text.text;
  const currency = values.currencyId.currencyId.selected_option.text.text;
  const place = values.placeId.placeId.selected_option.text.text;

  const commentArr: string[] = [
    values.comment.comment.value || values.tags.tags.selected_options.length
      ? "Комментарий:\n" + values.comment.comment.value
      : "",
    ...values.tags.tags.selected_options.map((item) => `[${item.text.text}]`),
  ];
  const comment = commentArr.join(" ");

  const recordDateText = values.recordDate.recordDate.selected_date
    ? "Дата: " + values.recordDate.recordDate.selected_date
    : "";

  let detailsText = "";
  if (comment === "" && recordDateText === "") {
    // do nothing
  } else {
    detailsText += "```";
    if (comment !== "") {
      detailsText += comment;
    }
    if (recordDateText !== "") {
      detailsText += "\n";
      detailsText += recordDateText;
    }
    detailsText += "```";
  }

  return {
    text: `Новая трата на сумму ${sumFormatted} ${currency} от <@${user}>, категория ${category}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Расход :money_with_wings: на сумму ${sumFormatted} ${currency} из кошелька ${place}, категория ${category}, ввел(а) <@${user}> ${detailsText}`,
        },
      },
    ],
  };
}
