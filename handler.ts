import * as _ from 'lodash'
import ddClient from './ddClient';
import * as ddApi from './ddApi';
import { CreateExpenseParams } from './ts-ddng-client/src/messages/setRecordList'

// modern module syntax
export async function hello(event, context, callback) {

  // const balances = await ddClient.getBalance({});

  // const categories = await ddApi.getCategoryList()
  // console.log(categories)

  // const places = await ddClient.getPlaces()
  const currencies = await ddApi.getCurrencyList()

//   const createExpenseParams: CreateExpenseParams = {
//       placeId: 40034,
//       comment: 'cool drug ' + (new Date()).toISOString(),
//       sum: 322,
//       currencyId: 17,
//       categoryId: 40012
//   }
//   const createExpenseResult = await client.createExpense(createExpenseParams)
//   console.log('createExenseResult', createExpenseResult)


  await new Promise((resolve, reject) => setTimeout(resolve, 500))

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go 55 Serverless v1.0! Your function executed successfully!',
      // env: process.env.SLACK_SIGNING_SECRET,
      // categories,
      // places,
      currencies,
      // balances,
      // input: event,
    }),
  };

  return response;
}