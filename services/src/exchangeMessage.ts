import { toMoneyFormat } from "./common";
import { ExchangeFormResult } from "./exchangeFormResultInterface";

interface MessageBlocks {
  text: string;
  blocks?: any[];
}

export async function exchangeMessage(
  values: ExchangeFormResult,
  user: string
): Promise<MessageBlocks> {
  const place = values.placeId.placeId.selected_option.text.text;

  const fromSum = +values.fromSum.fromSum.value;
  const fromCurrency = values.fromCurrencyId.fromCurrencyId.selected_option.text.text;

  const sum = +values.sum.sum.value;
  const currency = values.currencyId.currencyId.selected_option.text.text;

  const fromToCurrencyRate = sum / fromSum;
  const toFromCurrencyRate = fromSum / sum;

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

  return {
    text: `:currency_exchange: Обмен валюты ${toMoneyFormat(fromSum)} ${fromCurrency} на ${toMoneyFormat(sum)} ${currency} в месте хранения ${place} по курсу 1 ${fromCurrency} = ${toMoneyFormat(fromToCurrencyRate)} ${currency} (1 ${currency} = ${toMoneyFormat(toFromCurrencyRate)} ${fromCurrency}), ввел(а) <@${user}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:currency_exchange: Обмен валюты ${toMoneyFormat(fromSum)} ${fromCurrency} на ${toMoneyFormat(sum)} ${currency} в месте хранения ${place} по курсу 1 ${fromCurrency} = ${toMoneyFormat(fromToCurrencyRate)} ${currency} (1 ${currency} = ${toMoneyFormat(toFromCurrencyRate)} ${fromCurrency}), ввел(а) <@${user}> ${detailsText}`,
        }
      },
    ],
  };
}
