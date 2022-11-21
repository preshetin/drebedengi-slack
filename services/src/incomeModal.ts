import { WebClient } from "@slack/web-api";
import * as ddApi from "./ddApi";
import ddClient from "./ddClient";

export async function openIncomeModal(client: WebClient, triggerId: string) {
  const places = await ddClient.getPlaces();
  const placesOptions = buildPlacesOptions(places);

  const sources = await ddClient.getSourceList();
  const sourcesOptions = buildSourcesOptions(sources);

  const currencies = await ddClient.getCurrencyList();
  const currencyOptions = buildCurencyOptions(currencies);

  await client.views.open({
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "income-modal-submit",
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
        text: "Добавить доход",
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
          block_id: "sourceId",
          element: {
            action_id: "sourceId",
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Выберите из списка",
              emoji: true,
            },
            options: sourcesOptions,
          },
          label: {
            type: "plain_text",
            text: "Источник дохода",
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
              text: "Например, дата курса",
            },
            multiline: true,
          },
          label: {
            type: "plain_text",
            text: "Комментарий",
          },
          optional: true,
        },
        // There is no category when adding income.
        //
        // {
        //   type: "input",
        //   block_id: "categoryId",
        //   element: {
        //     action_id: "categoryId",
        //     type: "static_select",
        //     placeholder: {
        //       type: "plain_text",
        //       text: "Выберите категорию",
        //       emoji: true,
        //     },
        //     options: categoriesOptions,
        //   },
        //   label: {
        //     type: "plain_text",
        //     text: "Категория",
        //     emoji: true,
        //   },
        // },
        {
          type: "input",
          block_id: "recordDate",
          element: {
            action_id: "recordDate",
            type: "datepicker",
            placeholder: {
              type: "plain_text",
              text: "Если доход сегодня, можете оставить пустым",
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
    },
  });
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
