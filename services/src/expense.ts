import { ModalView } from "@slack/bolt";
import * as ddApi from "./ddApi";
import axios from "axios";
import ddClient from "./ddClient";

export async function buildExpenseModalView(): Promise<ModalView> {
  const categories = await ddClient.getCategoryList();
  const categoriesOptions = buildCategoriesOptions(categories);

  let tags = await ddClient.getTagList();
  tags = tags.filter((tagItem: any) => tagItem.is_hidden === "f");
  tags = tags.filter((tagItem: any) => !tagItem.name.includes("введено "));
  const tagsOptions = buildTagsOptions(tags);

  const places = await ddClient.getPlaces();
  const placesOptions = buildPlacesOptions(places);

  const currencies = await ddClient.getCurrencyList();
  const currencyOptions = buildCurencyOptions(currencies);

  return {
    type: "modal",
    callback_id: "expense-modal-submit",
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
      text: "Внести расход",
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
        block_id: "comment",
        element: {
          action_id: "comment",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "На что были потрачены деньги",
          },
          multiline: true,
        },
        label: {
          type: "plain_text",
          text: "Описание траты",
        },
      },
      {
        type: "input",
        block_id: "categoryId",
        element: {
          action_id: "categoryId",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Выберите категорию",
            emoji: true,
          },
          options: categoriesOptions,
        },
        label: {
          type: "plain_text",
          text: "Категория",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "tags",
        element: {
          action_id: "tags",
          type: "multi_static_select",
          placeholder: {
            type: "plain_text",
            text: "Добавьте теги",
            emoji: true,
          },
          options: tagsOptions,
        },
        label: {
          type: "plain_text",
          text: "Теги",
          emoji: true,
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
            text: "Если трата сегодня, можете оставить пустым",
          },
        },
        label: {
          type: "plain_text",
          text: "Дата операции",
          emoji: true,
        },
        optional: true,
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "ignoreNotification",
        element: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "plain_text",
                text: "Не отправлять уведомоление",
                emoji: true,
              },
              value: "yes",
            },
          ],
          action_id: "ignoreNotification",
        },
        label: {
          type: "plain_text",
          text: "Уведомление в Slack",
          emoji: true,
        },
        optional: true,
      },
    ],
  };
}

export async function notify(body: any) {
  // TODO: respond should be supported by Bolt
  const responseUrl = (body as any).response_url;
  console.log("responseUrl", responseUrl);
  if (responseUrl && responseUrl.length > 0) {
    const url = responseUrl;
    console.log("url", url, JSON.stringify(body.view.state.values));
    await axios.post(url, {
      text: "```" + JSON.stringify(body.view.state.values) + "```",
    });
  }
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

function buildTagsOptions(tags: any[]): any[] {
  return tags.map((item) => ({
    text: {
      type: "plain_text",
      text: item.name,
    },
    value: `${item.id}`,
  }));
}
