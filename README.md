# slack-twitter-bot

## prerequisites

### ./data/tokens.json

```json
[
  {
    "consumer_key": "{{CONSUMER_KEY}}",
    "consumer_secret": "{{CONSUMER_SECRET}}",
    "access_token": "{{ACCESS_TOKEN}}",
    "access_token_secret": "{{ACCESS_TOKEN_SECRET}}"
  }
]
```

### ./data/subscriptions.json

```json
[
  {
    "id": 1,
    "type": "user",
    "user": 0,
    "value": "twitter",
    "url": "{{SLACK_WEBHOOK_URL}}"
  },
  {
    "id": 2,
    "type": "list",
    "user": 0,
    "value": "{{LIST_ID}}",
    "url": "{{SLACK_WEBHOOK_URL}}",
    "attributes": [
      "strip_retweets",
      "ignore_retweets",
      "ignore_non_media_tweets",
      "ignore_sensitive_tweets"
    ]
  }
]
```

## quick start

### start

#### node

```sh
npm start
```

#### docker-compose

```sh
bash ./scripts/start.sh
```
