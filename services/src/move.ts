import { ModalView } from "@slack/bolt";
import * as ddApi from "./ddApi";
import ddClient from "./ddClient";

export async function moveModalView(): Promise<ModalView> {
  const places = await ddClient.getPlaces();
  const placesOptions = buildPlacesOptions(places);

  const currencies = await ddApi.getCurrencyList();
  const currencyOptions = buildCurencyOptions(currencies);

  return {
    type: "modal",
    callback_id: "move-modal-submit",
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
      text: "Создать перемещение",
      emoji: true,
    },
    blocks: [
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
            text: "Выберите валюту из списка",
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
        block_id: "fromPlaceId",
        element: {
          action_id: "fromPlaceId",
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
          text: "Место хранения, откуда",
          emoji: true,
        },
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
          text: "Место хранения, куда",
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
            text: "Например, причина перемещения",
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
            text: "Если это сегодня, можете оставить пустым",
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
