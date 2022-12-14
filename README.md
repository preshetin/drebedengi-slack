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

## Before you start:
- You need AWS account with `aws` CLI command installed. To install `aws` CLI command check out [this guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- Create test [Slack Workspace](https://slack.com/get-started) so that you can safely install Slack app.

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

In terminal output, note `ApiEndpoint` that looks like `https://xxx.execute-api.us-east-1.amazonaws.com`. You will need when configuring your Slack app.

4. Now go to https://api.slack.com/apps and create Slack app. Choose the workspace you are installing the app. Make use of `ApiEndoint` value and [this manifest] file.

5. TODO: Finish it.


## How to send reminder to fill place of storage

Use `/drebedengi` slash command like this:

```
/drebedengi remind @some_user
```
