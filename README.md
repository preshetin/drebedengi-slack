<!--
title: 'Drebedengi Slack App'
description: 'Slack app that helps working with Drebedengi personal finance'
authorLink: 'https://github.com/preshetin'
authorName: 'Peter Reshetin'
-->

# Drebedengi Slack App

![drebedengi-demo](https://user-images.githubusercontent.com/4620130/205003685-42b40bf0-a997-41a0-80bb-e60df2c34996.gif)

<details>

<summary>Click to see more screenshots</summary>

### Add expenses to Drebedengi, check balance via Slack app
<img width="604" alt="CleanShot 2022-11-23 at 17 16 29@2x" src="https://user-images.githubusercontent.com/4620130/203544801-3ed966cd-bc81-49ca-87e2-596dbea38931.png">

<img width="571" alt="CleanShot 2022-11-23 at 17 18 07@2x" src="https://user-images.githubusercontent.com/4620130/203545083-fa04223c-be94-4a19-b7c1-2a8615dda746.png">

### Get notified about expenses and income

<img width="442" alt="CleanShot 2022-11-23 at 17 19 29@2x" src="https://user-images.githubusercontent.com/4620130/203545291-3c8884a0-6df2-45eb-a3c6-cd181990042b.png">

</details>

# Installation

This app is deployed to AWS using [SST](https://github.com/serverless-stack/sst). 

## Before you start
- You need AWS account with `aws` CLI command installed. To install `aws` CLI command check out [this guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- It is good to create sandbox [Slack Workspace](https://slack.com/get-started) so that you can safely install Slack app.

## How to install Slack app locally
1. Clone this repo and install dependencies
```
gh repo clone preshetin/drebedengi-slack
cd drebedengi-slack
yarn
```

2. Copy environmental variables
```
cp env.example .env
```

3. Start local development
```
yarn start
```

If everything goes fine, in the end you will see `ApiEndpoint` that looks like `https://xxx.execute-api.us-east-1.amazonaws.com`. Note it since you will need when configuring your Slack app (see next step).

4. Now go to https://api.slack.com/apps and create your Slack app. Choose the workspace you are installing the app. Insert this [this manifest template](https://github.com/preshetin/drebedengi-slack/blob/main/app_manifest.yml) file. In that template, make sure to enter `ApiEndpoint` value in several places.
5. Once your app Slack app is ready, grab its keys for the `.env` file. For `SLACK_SIGNING_SECRET`, navigate to its Basic Information page, App Credentials part. For `SLACK_BOT_TOKEN`, go to Install App page and install the app into your workspace. Once you do that, you will be able to get the value for this env variable. For `NOTIFICATION_CHANNEL_ID`, get channel ID from Slack workspace. If you cannot find it [these](https://www.wikihow.com/Find-a-Channel-ID-on-Slack-on-PC-or-Mac) [links](https://help.socialintents.com/article/148-how-to-find-your-slack-team-id-and-slack-channel-id) can be helpful.
6. Once your your `.env` file is updated, `yarn start` it once again. 
7. Now go to your Slack workspace, type `/drebedengi` and hit enter.
8. To enabale bot messages to the notification channel you need to add your app user to it. You can do it by running `/invite @yourBot` slash command.


## How to send reminder to fill place of storage

Use `/drebedengi` slash command like this:

```
/drebedengi remind @some_user
```
