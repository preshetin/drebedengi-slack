import { IncomeFormResult } from "./incomeFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export function incomeMessage(
  values: IncomeFormResult,
  balanceSum: number,
  balanceCurrency: string,
  user: string
): MessageBlocks {
  const sum = +values.sum.sum.value;
  const sumFormatted = sum.toLocaleString();

  const currency = values.currencyId.currencyId.selected_option.text.text;
  const source = values.sourceId.sourceId.selected_option.text.text;
  const place = values.placeId.placeId.selected_option.text.text;

  const commentArr: string[] = [
    values.comment.comment.value || values.tags.tags.selected_options.length
      ? "Комментарий:\n" +
        (values.comment.comment.value ? values.comment.comment.value : "")
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

  // +1000 RUB на _Сбербанк_. (источник _Консультации Светы_), ввел(а) preshetin ```Комментарий:\nПеревод по СБП. ФИО отправителя: Алексей Сергеевич Г.\nДата: 2022-06-15```

  return {
    text: `+${sumFormatted} ${currency} доход :moneybag: в место хранения ${place}. Баланс ${balanceSum.toLocaleString()} ${balanceCurrency}. Источник ${source}, ввел(а) <@${user}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `+${sumFormatted} ${currency} доход :moneybag: в место хранения ${place}. Баланс ${balanceSum.toLocaleString()} ${balanceCurrency}. Источник ${source}, ввел(а) <@${user}> ${detailsText}`,
        },
      },
    ],
  };
}
