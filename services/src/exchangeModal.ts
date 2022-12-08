import { ModalView } from "@slack/bolt";
import ddClient from "./ddClient";

export async function exchangeModalView(): Promise<ModalView> {
  const places = await ddClient.getPlaces();
  const placesOptions = buildPlacesOptions(places);

  const sources = await ddClient.getSourceList();
  const sourcesOptions = buildSourcesOptions(sources);

  const currencies = await ddClient.getCurrencyList();
  const currencyOptions = buildCurencyOptions(currencies);

  return {
    type: "modal",
    callback_id: "exhange-modal-submit",
    submit: {
      type: "plain_text",
      text: "Отправить",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Отмена",
      emoji: true,
    },
    title: {
      type: "plain_text",
      text: "Обмен валют",
      emoji: true,
    },
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Продать",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "fromSum",
        element: {
          action_id: "fromSum",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "Сумма",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Cумма",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "fromCurrencyId",
        element: {
          action_id: "fromCurrencyId",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Выберите из списка",
            emoji: true,
          },
          options: currencyOptions,
        },
        label: {
          type: "plain_text",
          text: "Валюта",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Купить",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "sum",
        element: {
          action_id: "sum",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "Сумма",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Cумма",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "currencyId",
        element: {
          action_id: "currencyId",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Выберите из списка",
            emoji: true,
          },
          options: currencyOptions,
        },
        label: {
          type: "plain_text",
          text: "Валюта",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "placeId",
        element: {
          action_id: "placeId",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Выберите из списка",
            emoji: true,
          },
          options: placesOptions,
        },
        label: {
          type: "plain_text",
          text: "Кошелек / место хранения",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "comment",
        element: {
          action_id: "comment",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "Например, причина этой операции",
          },
          multiline: true,
        },
        label: {
          type: "plain_text",
          text: "Комментарий",
        },
        optional: true,
      },
      {
        type: "input",
        block_id: "recordDate",
        element: {
          action_id: "recordDate",
          type: "datepicker",
          placeholder: {
            type: "plain_text",
            text: "Если эта опрерация сегодня, оставьте пустым",
          },
        },
        label: {
          type: "plain_text",
          text: "Дата операции",
          emoji: true,
        },
        optional: true,
      },
    ],
  };
}

function buildCurencyOptions(currencies: any[]): any[] {
  return currencies.map((currency) => ({
    text: {
      type: "plain_text",
      text: currency.code,
    },
    value: `${currency.id}`,
  }));
}

function buildPlacesOptions(
  places: import("./ts-ddng-client/src/messages/getPlaceList").Place[]
): any[] {
  return places.map((place) => ({
    text: {
      type: "plain_text",
      text: place.name,
    },
    value: `${place.id}`,
  }));
}

function buildCategoriesOptions(categories: any[]): any[] {
  return categories.map((category) => ({
    text: {
      type: "plain_text",
      text: category.name,
    },
    value: `${category.id}`,
  }));
}

function buildSourcesOptions(sources: any[]): any[] {
  return sources.map((source) => ({
    text: {
      type: "plain_text",
      text: source.name,
    },
    value: `${source.id}`,
  }));
}

// TODO: make it DRY (it is copied from expense modal)
function buildTagsOptions(tags: any[]): any[] {
  return tags.map((item) => ({
    text: {
      type: "plain_text",
      text: item.name,
    },
    value: `${item.id}`,
  }));
}
