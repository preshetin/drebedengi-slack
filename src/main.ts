// import { loadEnv } from './dotenv';
// loadEnv();

import { App, AwsLambdaReceiver } from '@slack/bolt';
import { LogLevel } from '@slack/logger';
import { registerListeners } from './listeners';
import { AwsEvent, AwsCallback } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

console.log('slack signing secret', process.env.SLACK_SIGNING_SECRET)

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

const logLevel = process.env.SLACK_LOG_LEVEL as LogLevel || LogLevel.INFO;
const app = new App({
  logLevel,
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver
});

registerListeners(app);

export async function handler (event: AwsEvent, context: any, callback: AwsCallback) {

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go 33 Serverless v1.0! Your function executed successfully!',
  //     env: process.env.SLACK_SIGNING_SECRET,
  //     input: event,
  //   }),
  // };
  // return response;


  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}
