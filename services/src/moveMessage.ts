import ddClient from "./ddClient";
import * as ddApi from "./ddApi";
import { MoveFormResult } from "./moveFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export async function moveMessage(
  values: MoveFormResult,
  user: string
): Promise<MessageBlocks> {
  const sum = +values.sum.sum.value;
  const sumFormatted = sum.toLocaleString();

  const currency = values.currencyId.currencyId.selected_option.text.text;
  const place = values.placeId.placeId.selected_option.text.text;
  const fromPlace = values.fromPlaceId.fromPlaceId.selected_option.text.text;

  const commentText = values.comment.comment.value
    ? `Комментарий:\n${values.comment.comment.value}`
    : "";

  const recordDateText = values.recordDate.recordDate.selected_date
    ? "Дата: " + values.recordDate.recordDate.selected_date
    : "";

  let detailsText = "";
  if (commentText === "" && recordDateText === "") {
    // do nothing
  } else {
    detailsText += "```";
    if (commentText !== "") {
      detailsText += commentText;
    }
    if (recordDateText !== "") {
      detailsText += "\n";
      detailsText += recordDateText;
    }
    detailsText += "```";
  }

  // +1000 RUB на _Сбербанк_. (источник _Консультации Светы_), ввел(а) preshetin ```Комментарий:\nПеревод по СБП. ФИО отправителя: Алексей Сергеевич Г.\nДата: 2022-06-15```

  return {
    text: `Перемещение ${sumFormatted} ${currency} из места хранения ${fromPlace} в место хранения ${place}, ввел(а) <@${user}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Перемещение ${sumFormatted} ${currency} из места хранения ${fromPlace} в место хранения ${place}, ввел(а) <@${user}> ${detailsText}`,
        },
      },
    ],
  };
}
