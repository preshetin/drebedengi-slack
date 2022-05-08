import { WebClient } from "@slack/web-api";
import axios from "axios";
import ddClient from "../ddClient";

export async function openModal(client: WebClient, triggerId: string) {
  const categories = await ddClient.getCategoryList();

  const places = await ddClient.getPlaces();
  const placesOptions = buildPlacesOptions(places)

  const currencies = await ddClient.getCurrencyList();
  const currencyOptions = buildCurencyOptions(currencies);

  await client.views.open({
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "request-modal",
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      title: {
        type: "plain_text",
        text: "Добавить Расход",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: 'recordType',
          element: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Расход или поступление",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: ":heavy_minus_sign: Расход",
                  emoji: true,
                },
                value: "expense",
              },
              {
                text: {
                  type: "plain_text",
                  text: ":heavy_plus_sign: Поступление",
                  emoji: true,
                },
                value: "income",
              },
            ],
            action_id: "recordType",
          },
          label: {
            type: "plain_text",
            text: "Расход или поступление",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: 'sum',
          element: {
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
          block_id: 'currencyId',
          element: {
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
          type: "input",
          block_id: 'placeId',
          element: {
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
          type: 'divider'
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
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
          element: {
            type: "datepicker",
            placeholder: {
              type: "plain_text",
              text: "Select a date",
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

export async function notify(body: any) {
  // TODO: respond should be supported by Bolt
  const responseUrl = (body as any).response_url;
  console.log('responseUrl', responseUrl)
  if (responseUrl && responseUrl.length > 0) {
    const url = responseUrl
    console.log('url', url,  JSON.stringify(body.view.state.values))
    await axios.post(url, {
      text: "```" + JSON.stringify(body.view.state.values) + "```",
    });
  }
}

function buildCurencyOptions(currencies: any[]): any[] {
  return currencies.map(currency => ({
    text: {
      type: 'plain_text',
      text: currency.code,
    },
    value: `${currency.id}`
  }))
}

function buildPlacesOptions(places: import("../ts-ddng-client/src/messages/getPlaceList").Place[]): any[] {
  return places.map(place => ({
    text: {
      type: 'plain_text',
      text: place.name,
    },
    value: `${place.id}`
  }))
}