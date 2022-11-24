import ddClient from "./ddClient";
import * as ddApi from "./ddApi";

export async function hello(event, context, callback) {
  const balances = await ddClient.getBalance({});

  //const places = await ddClient.getPlaces();
  // const currencies = await ddClient.getCurrencyList();
  // const categories = await ddApi.getCategoryList();

  //  const dadOperations = await ddClient.getOperations({
  //    placeIds: [40032]
  //  })

  const tags = await ddClient.getTagList();

  // const res = await ddClient.createMove({
  //   fromPlaceId: 111,
  //   placeId: 222,
  //   sum: 123,
  //   currencyId: 123
  // })

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      //dadOperations,
      balances,
      // env: process.env.SLACK_SIGNING_SECRET,
      // places,
      // currencies,
      // balances,
      // input: event,
    }),
  };

  return response;
}
