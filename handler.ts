import * as _ from 'lodash'
import ddClient from './ddClient';
import { GetBalanceParams } from './ts-ddng-client/src/messages/getBalance'
import { CreateExpenseParams } from './ts-ddng-client/src/messages/setRecordList'

// modern module syntax
export async function hello(event, context, callback) {

  // dependencies work as expected
//   console.log(_.VERSION)

  const params: GetBalanceParams = { };
  const balances = await ddClient.getBalance(params);

//   const createExpenseParams: CreateExpenseParams = {
//       placeId: 40034,
//       comment: 'cool drug ' + (new Date()).toISOString(),
//       sum: 322,
//       currencyId: 17,
//       categoryId: 40012
//   }
//   const createExpenseResult = await client.createExpense(createExpenseParams)
//   console.log('createExenseResult', createExpenseResult)


  // async/await also works out of the box
  await new Promise((resolve, reject) => setTimeout(resolve, 500))

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go 44 Serverless v1.0! Your function executed successfully!',
      env: process.env.SLACK_SIGNING_SECRET,
      balances,
      input: event,
    }),
  };

  return response;
}