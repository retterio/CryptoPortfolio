# How Build & Deploy

### Rio CLI is required to use this project. You can follow instructions of documentation.
```bash
https://docs.retter.io/docs/cli
```

## Getting Project Ready

####  1-) Change projectId with your projects id inside "rio.json".
####  2-) Open terminal in project directory and install libraries with
```bash
npm i
```
####  3-) Chnage directory of terminal to classes and again install libraries.
####  4-) Now you can deploy project to rio. 

## Deployment


```bash
rio deploy --project-id YOUR_PROJECT_ID --profile YOUR_PROFILE_NAME
```

# How it works

Wallet.ts

upsertToken -> input: primary, quantity
reduceToken -> input: primary, quantity

getBalanceAs ->  input: secondary
getWallet -> return data.state.public.wallet
getCoins -> return coins

Alarm.ts

addAlarm -> input: id, coinName, lowerLimit, threshold
alarmController -> this function gets called with tasks. It will add triggeredAlarms into state.
addAlarm -> input: id, removes alarm with the id given

# Input for tests 

upsertToken Body
```bash
{
  "baseAsset": "ETH",
  "quantity": 5
}
```

Then

getBalance Body
```bash
{
    {"secondary": "BTC"}
}
```