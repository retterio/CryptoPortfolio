import { Data } from "@retter/rdk"
import test from 'ava'
import { addAlarm, alarmController, removeAlarm } from "../alarm"
import { cloneDeep } from 'lodash'
import { binanceClient } from ".."

const getMockedData = (): Data => ({
    context: {
        projectId: 'testProject',
        classId: 'testClassId',
        instanceId: 'testInstanceId',
        identity: 'testIdentity',
        action: 'testAction',
        methodName: 'testMethodName',
        requestId: 'testRequestId',
        sourceIP: 'testSourceIP',
        claims: {
            tags: ['REGIONAL_MANAGER#testInstanceId'],
        },
    },
    state: {
        public: { wallet: [], alarms: [] },
        private: {},
    },
    config: {},
    env: {},
    request: {
        headers: {},
        httpMethod: 'testHttpMethod',
        queryStringParams: {},
    },
    response: {
        statusCode: 200,
    },
    tasks: [],
    version: 0,
} as any)


test.serial('test startAlarm', async (t) => {
    const data = cloneDeep(getMockedData())
    data.request.body = {
        id: "1",
        coinName: "ETH",
        lowerLimit: false,
        threshold: 1000000
    }

    await addAlarm(data)
    t.deepEqual(data.state.public.alarms, [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: false,
            threshold: 1000000
        }
    ])
})




test.serial('test alarmController', async (t) => {
    const data = cloneDeep(getMockedData())
    //********//
    data.state.public.alarms = [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true,
            threshold: 1000000
        }
    ]
    await alarmController(data)
    t.deepEqual(data.state.public.triggeredAlarms, [])
    //********//
    data.state.public.alarms = [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true,
            threshold: 1200.0
        }
    ]
    await alarmController(data)
    t.deepEqual(data.state.public.triggeredAlarms, [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true
        }
    ])
    //********//
    data.state.public.alarms = [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true,
            threshold: 1200
        },
        {
            id: "2",
            coinName: "BTC",
            lowerLimit: false,
            threshold: 17000
        }
    ]
    await alarmController(data)
    t.deepEqual(data.state.public.triggeredAlarms, [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true
        },
        {
            id: "2",
            coinName: "BTC",
            lowerLimit: false
        }
    ])
    //********//
    data.state.public.alarms = [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true,
            threshold: 1200
        },
        {
            id: "2",
            coinName: "BTC",
            lowerLimit: true,
            threshold: 17000
        }
    ]
    await alarmController(data)
    t.deepEqual(data.state.public.triggeredAlarms, [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true
        }
    ])
    //********//
})

test.serial('test removeAlarm', async (t) => {
    const data = cloneDeep(getMockedData())
    //********//
    data.state.public.alarms = [
        {
            id: "1",
            coinName: "ETH",
            lowerLimit: true,
            threshold: 1000000
        }
    ]
    data.request.body = {
        id: "1"
    }
    await removeAlarm(data)
    t.deepEqual(data.state.public.alarms, [])
    //********//
})