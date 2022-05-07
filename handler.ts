import * as _ from 'lodash'
import {ApiClient} from './ts-ddng-client/src/index'
import { GetBalanceParams } from './ts-ddng-client/src/messages/getBalance'
import { CreateExpenseParams } from './ts-ddng-client/src/messages/setRecordList'

// modern module syntax
export async function hello(event, context, callback) {

  // dependencies work as expected
  console.log(_.VERSION)

  const client = new ApiClient('demo_api', 'demo@example.com', 'demo')

  const params: GetBalanceParams = { };
  const balances = await client.getBalance(params);
//   console.log('balances', balances);

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
      message: 'Go 11 Serverless v1.0! Your function executed successfully!',
      balances,
      input: event,
    }),
  };

  callback(null, response);
}