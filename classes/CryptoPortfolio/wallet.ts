import RDK, { Data, InitResponse, Response, StepResponse } from "@retter/rdk"
import { binanceClient } from "."
import { Coin, ReduceTokenInput, Wallet } from "./types"


// *****************

export async function getCoins(data: Data): Promise<StepResponse> {
  try {
    const coinNames = await binanceClient.exchangeInfo()
    const prices = await binanceClient.prices()
    const coinList: Coin[] = [] 
  
    coinNames.symbols.map(async (coin) => {
      coinList.push({ primary: coin.baseAsset, secondary: coin.quoteAsset, price: prices[coin.symbol] })
    })
  
     data.response = {
      statusCode: 200,
      body: { success: true, data: coinList },
    }
  } catch (e) {
    data.response = {
      statusCode: 400,
      body: { succes: false, error: e.message },
    }
  }

  return data
}

export async function upsertToken(data: Data): Promise<StepResponse> {
  try {
    const { primary, quantity } = data.request.body as Coin
    const wallet = data.state.public.wallet as Wallet

    const targetCoin = wallet.find((coin: Coin) => coin.primary === primary)
    console.log(targetCoin);
    
    if (!targetCoin)
      wallet.push({ primary, quantity })
    else
      targetCoin.quantity += quantity

    data.response = {
      statusCode: 200,
      body: { success: true, data: { primary, quantity} },
    }
  } catch (e) {
    data.response = {
      statusCode: 400,
      body: { succes: false, error: e.message },
    }
  }

  return data
}

export async function reduceToken(data: Data): Promise<StepResponse> {
  try {
    const { primary, quantity } = data.request.body as Coin
    const wallet = data.state.public.wallet as Wallet

    const targetCoin = wallet.find((coin: Coin) => coin.primary === primary)

    if (!targetCoin) throw new Error("insufficent balance")

    if (targetCoin.quantity - quantity < 0) throw new Error("insufficent balance")

    targetCoin.quantity -= quantity

    data.response = {
      statusCode: 200,
      body: { success: true, data: { primary, quantity: targetCoin.quantity } },
    }
  } catch (e) {
    data.response = {
      statusCode: 400,
      body: { succes: false, error: e.message },
    }
  }

  return data
}

export async function getWallet(data: Data): Promise<StepResponse> {
  try {
    data.response = {
      statusCode: 200,
      body: { success: true, data: data.state.public.wallet },
    }
  } catch (e) {
    data.response = {
      statusCode: 400,
      body: { succes: false, error: e.message },
    }
  }

  return data
}

// get wallet coin balance values as BTC
// get values coin balance values as BUSD
export async function getBalanceAs(data: Data): Promise<StepResponse> {
  try {
    const as = data.request.body.as  as string
    const wallet = data.state.public.wallet as ReduceTokenInput[]

    const prices = await binanceClient.prices()

    let totalBalance = 0
   
    wallet.forEach((coin: Coin) => {
      const price = parseFloat(prices[coin.primary + as])
      
      if (!price) { 
        throw new Error(coin.primary + " cannot converted to " + as) 
      }

      totalBalance += coin.quantity * price
    })

    data.response = {
      statusCode: 200,
      body: { success: true, data: totalBalance },
    }
  } catch (e) {
    data.response = {
      statusCode: 400,
      body: { succes: false, error: e.message },
    }
  }

  return data
}