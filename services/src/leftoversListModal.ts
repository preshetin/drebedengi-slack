import { ModalView } from "@slack/bolt";
import * as ddApi from "./ddApi";
import axios from "axios";
import ddClient from "./ddClient";

export async function buildLeftoversListModalView(category: string): Promise<ModalView> {

  console.log('11111')

  // const categories = await ddClient.getCategoryList();
  // const categoriesOptions = buildCategoriesOptions(categories);


  let ingredientList: {item: string, item_en: string}[] = [];

  // if (category === 'овощи') {
    ingredientList = [
      { item: "Кабачок", item_en: "Zucchini" },
      { item: "Капуста кочанная", item_en: "Cabbageheadofcabbage" },
      { item: "Капуста пекинская/Айсберг/Лола", item_en: "ChineseCabbage" },
      { item: "Картофель", item_en: "Potato" },
      { item: "Морковь", item_en: "Carrot" },
      { item: "Огурец", item_en: "Cucumber" },
      { item: "Перец болгарский", item_en: "BellPepper" },
      { item: "Помидор", item_en: "Tomato" },
      { item: "Свекла", item_en: "Beetroot" },
      { item: "Тыква сырая", item_en: "RawPumpkin" }
    ];
  // }


  return {
    type: "modal",
    callback_id: "leftovers-list-modal-submit",
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
      text: `Ocтатки: ${category}`,
      emoji: true,
    },
    blocks: ingredientList.map(el => ({
        type: "input",
        block_id: el.item_en,
        element: {
          action_id: el.item_en,
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "введите остаток",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: el.item,
          emoji: true,
        },
    }))
    // blocks: [
    //   {
    //     type: "input",
    //     block_id: "sum",
    //     element: {
    //       action_id: "sum",
    //       type: "plain_text_input",
    //       placeholder: {
    //         type: "plain_text",
    //         text: "Сумма",
    //         emoji: true,
    //       },
    //     },
    //     label: {
    //       type: "plain_text",
    //       text: "Cумма",
    //       emoji: true,
    //     },
    //   },
    // ],
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
