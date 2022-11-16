import RDK, { Data, InitResponse, Response, StepResponse } from "@retter/rdk"
import * as dotenv from 'dotenv'
import Binance from 'binance-api-node'


dotenv.config()
const rdk = new RDK()

export const binanceClient = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY
})

export async function authorizer(data: Data): Promise<Response> {
  return { statusCode: 200 }
}

export async function init(data: Data): Promise<InitResponse> {
  return { state: { public: { wallet: [], alarms: [] } } }
}

export async function getState(data: Data): Promise<Response> {
  return { statusCode: 200, body: data.state }
}


