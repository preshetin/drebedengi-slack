import ddClient from "./ddClient";
import demoApiCategories from "./dd_cache/demo_api/categories.json";
import vipassanaApiCategories from "./dd_cache/vipassana_api/categories.json";
import demoApiCurrencies from "./dd_cache/demo_api/currencies.json";
import vipassanaApiCurrencies from "./dd_cache/vipassana_api/currencies.json";
import demoApiPlaces from "./dd_cache/demo_api/places.json";
import vipassanaApiPlaces from "./dd_cache/vipassana_api/places.json";
import demoApiSources from './dd_cache/demo_api/sources.json'
import vipassanaApiSources from './dd_cache/vipassana_api/sources.json'

let categories;
switch (process.env.DREBEDENGI_API_ID) {
  case "demo_api":
    categories = demoApiCategories;
    break;
  case "vipassana_api":
    categories = vipassanaApiCategories;
    break;
}

let currencies;
switch (process.env.DREBEDENGI_API_ID) {
  case "demo_api":
    currencies = demoApiCurrencies;
    break;
  case "vipassana_api":
    currencies = vipassanaApiCurrencies;
    break;
}

let places;
switch (process.env.DREBEDENGI_API_ID) {
  case "demo_api":
    places = demoApiPlaces;
    break;
  case "vipassana_api":
    places = vipassanaApiPlaces;
    break;
}

let sources;
switch (process.env.DREBEDENGI_API_ID) {
  case "demo_api":
    sources = demoApiSources;
    break;
  case "vipassana_api":
    sources = vipassanaApiSources;
    break;
}

const ENABLE_CACHE = "yes";

const getCategoryList = async () => {
  if (ENABLE_CACHE === "yes") {
    console.log("Categories FROM CACHE");
    return categories;
  } else {
    return await ddClient.getCategoryList();
  }
};

const getCurrencyList = async () => {
  if (ENABLE_CACHE === "yes") {
    console.log("Currencies FROM CACHE");
    return currencies;
  } else {
    return await ddClient.getCurrencyList();
  }
};

const getPlaceList = async () => {
  if (ENABLE_CACHE === "yes") {
    console.log("Places FROM CACHE");
    return places;
  } else {
    return await ddClient.getPlaces();
  }
};

const getSourceList = async () => {
  if (ENABLE_CACHE === "yes") {
    console.log("Sources FROM CACHE");
    return sources;
  } else {
    return await ddClient.getSourceList();
  }
};

export { getCategoryList, getCurrencyList, getPlaceList, getSourceList };
