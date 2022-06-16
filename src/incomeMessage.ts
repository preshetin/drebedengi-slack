import ddClient from "../ddClient";
import * as ddApi from "../ddApi";
import IncomeFormResult from "./incomeFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export async function incomeMessage(
  values: IncomeFormResult,
  user: string
): Promise<MessageBlocks> {

  const sum = values.sum.sum.value;

  const currency = values.currencyId.currencyId.selected_option.text.text;
  const source = values.sourceId.sourceId.selected_option.text.text;
  const place = values.placeId.placeId.selected_option.text.text;

  const commentText = values.comment.comment.value ? `, комментарий "${values.comment.comment.value}"` : '';

  const recordDateText = values.recordDate.recordDate.selected_date
    ? ', дата:' + values.recordDate.recordDate.selected_date
    : "";

  return {
    text: `+${sum} ${currency} на ${place} (источник ${source})${commentText}${recordDateText}, ввел(а) <@${user}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `+${sum} ${currency} на _${place}_ (источник _${source}_)${commentText}${recordDateText}, ввел(а) <@${user}>`,
        },
      },
    ],
  };
}
