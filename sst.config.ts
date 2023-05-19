import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "drebedengi-slack",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      nodejs: {
        format: 'esm',
        install: ['strong-soap']
      },
      environment: {
        DREBEDENGI_API_ID: process.env.DREBEDENGI_API_ID
          ? process.env.DREBEDENGI_API_ID
          : "fake_dd_api_id",
        DREBEDENGI_USERNAME: process.env.DREBEDENGI_USERNAME
          ? process.env.DREBEDENGI_USERNAME
          : "fake_dd_username",
        DREBEDENGI_PASSWORD: process.env.DREBEDENGI_PASSWORD
          ? process.env.DREBEDENGI_PASSWORD
          : "fake_dd_password",
        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET
          ? process.env.SLACK_SIGNING_SECRET
          : "fake_slack_signing_secret",
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
          ? process.env.SLACK_BOT_TOKEN
          : "fake_slack_bot_token",
        SLACK_LOG_LEVEL: process.env.SLACK_LOG_LEVEL
          ? process.env.SLACK_LOG_LEVEL
          : "error",
        NOTIFICATION_CHANNEL_ID: process.env.NOTIFICATION_CHANNEL_ID
          ? process.env.NOTIFICATION_CHANNEL_ID
          : "fake_notification_channel_id",
        SLACK_REQUEST_LOG_ENABLED: process.env.SLACK_REQUEST_LOG_ENABLED
          ? process.env.SLACK_REQUEST_LOG_ENABLED
          : '0',
      },
    });

    app.stack(API)
  },
} satisfies SSTConfig;