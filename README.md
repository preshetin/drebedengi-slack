<!--
title: 'Drebedengi Slack App'
description: 'Slack app that helps working with Drebedengi personal finance'
authorLink: 'https://github.com/preshetin'
authorName: 'Peter Reshetin'
-->

# Drebedengi Slack App

### Add expenses to Drebedengi, check balance via Slack app
<img width="604" alt="CleanShot 2022-11-23 at 17 16 29@2x" src="https://user-images.githubusercontent.com/4620130/203544801-3ed966cd-bc81-49ca-87e2-596dbea38931.png">

<img width="571" alt="CleanShot 2022-11-23 at 17 18 07@2x" src="https://user-images.githubusercontent.com/4620130/203545083-fa04223c-be94-4a19-b7c1-2a8615dda746.png">

### Get notified about expenses and income

<img width="442" alt="CleanShot 2022-11-23 at 17 19 29@2x" src="https://user-images.githubusercontent.com/4620130/203545291-3c8884a0-6df2-45eb-a3c6-cd181990042b.png">


## How to send reminder to fill place of storage

```
curl 'https://{AWS_URL}/remind_to_fill_in?user=U1234567' | jq
```

Things to note:
- The deployed function has env var that are connected to proper Slack app and Drebedengi account
- Make sure to fill proper notification channel URL at https://github.com/preshetin/drebedengi-slack/blob/73ec52cdfde4cddfcb9208bbc0818216e4f8c01a/services/src/listeners.ts#L299-L300
- Some text in reminder message is hardcoded, see https://github.com/preshetin/drebedengi-slack/blob/73ec52cdfde4cddfcb9208bbc0818216e4f8c01a/services/src/remind.ts#L50
