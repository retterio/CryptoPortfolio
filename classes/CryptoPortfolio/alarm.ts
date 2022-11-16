import RDK, { Data, InitResponse, Response, StepResponse } from "@retter/rdk"
import { binanceClient } from "."
import { Alarm } from "./types"


//****************************/

export async function addAlarm(data: Data): Promise<StepResponse> {
    try {
        const { id, coinName, lowerLimit, threshold } = data.request.body as Alarm
        const alarms = data.state.public.alarms as Alarm[]

        const newId = id ? id : Date.now().toString()

        alarms.push({id: newId, coinName, lowerLimit, threshold})

        data.tasks.push({
            after: 900,
            method: "alarmController"
        })

        data.response = {
            statusCode: 200,
            body: { success: true, message: `Alarm added for ${coinName} coin, price of ${threshold}.`},
        }
    } catch (e) {
        data.response = {
            statusCode: 400,
            body: { succes: false, error: e.message },
        }
    }

    return data
}


export async function alarmController(data: Data): Promise<StepResponse> {
    try {
        const alarms = data.state.public.alarms as Alarm[]

        if (alarms.length === 0) throw new Error(`There is no alarms set.`);

        const prices = await binanceClient.prices()
        const triggeredAlarms = []
        
        alarms.forEach((alarm) => {
            const price = parseFloat(prices[alarm.coinName + "USDT"])

            const isBelow = alarm.lowerLimit
            const ringAlarm = isBelow ? alarm.threshold < price : alarm.threshold > price

            if (!ringAlarm) return
                
            triggeredAlarms.push({ id: alarm.id, coinName: alarm.coinName, lowerLimit: isBelow })  
        })

        data.state.public.triggeredAlarms = triggeredAlarms
        
        data.response = {
            statusCode: 200,
            body: { succes: true, alarm: true }
        }
    } catch (e) {
        data.response = {
            statusCode: 400,
            body: { succes: false, error: e.message },
        }
    }

    return data
}

export async function removeAlarm(data: Data): Promise<StepResponse> {
    try {
        const { id } = data.request.body as Alarm
        const alarms = data.state.public.alarms as Alarm[]

        const index = alarms.findIndex(alarm => alarm.id === id)
        if (index === -1) throw new Error(`There is no alarm with id ${id}`);

        data.state.public.alarms = alarms.filter(alarm => alarm.id !== id)

        data.response = {
            statusCode: 200,
            body: { success: true },
        }
    } catch (e) {
        data.response = {
            statusCode: 400,
            body: { succes: false, error: e.message },
        }
    }

    return data
}