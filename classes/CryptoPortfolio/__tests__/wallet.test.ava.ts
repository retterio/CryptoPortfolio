import { Data } from "@retter/rdk"
import { getBalanceAs, getWallet, reduceToken, upsertToken } from "../wallet"
import test from 'ava'
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



test.serial('test upsertToken', async (t) => {
    const data = cloneDeep(getMockedData())
    data.request.body = {
        primary: "ETH",
        quantity: 5
    }
    t.deepEqual(data.state.public, { wallet: [], alarms: [] })
    await upsertToken(data)
    t.deepEqual(data.state.public, {
        wallet: [
            {
                primary: "ETH",
                quantity: 5
            }
        ],
        alarms: []
    })
})

test.serial('test reduceToken', async (t) => {
    const data = cloneDeep(getMockedData())
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    data.request.body = {
        primary: "ETH",
        quantity: 5
    }
    await reduceToken(data)
    t.deepEqual(data.state.public.wallet, [
        {
            primary: "ETH",
            quantity: 0
        }
    ])
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    data.request.body = {
        primary: "ETH",
        quantity: 4
    }
    await reduceToken(data)
    t.deepEqual(data.state.public.wallet, [
        {
            primary: "ETH",
            quantity: 1
        }
    ])
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    data.request.body = {
        primary: "ETH",
        quantity: 6
    }
    await reduceToken(data)
    t.deepEqual(data.response.body, {
        succes: false, error: "insufficent balance"
    })
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    data.request.body = {
        primary: "ETH",
        quantity: 4
    }
    await reduceToken(data)
    t.deepEqual(data.state.public.wallet, [
        {
            primary: "ETH",
            quantity: 1
        }
    ])
    //********//
    
})

test.serial('test getWallet', async (t) => {
    const data = cloneDeep(getMockedData())
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    await getWallet(data)
    t.deepEqual(data.state.public.wallet, [
        {
            primary: "ETH",
            quantity: 5
        }
    ])
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        },
        {
            primary: "BTC",
            quantity: 10
        }
    ]
    await getWallet(data)
    t.deepEqual(data.state.public.wallet, [
        {
            primary: "ETH",
            quantity: 5
        },
        {
            primary: "BTC",
            quantity: 10
        }
    ])
    //********//
    data.state.public.wallet = []
    await getWallet(data)
    t.deepEqual(data.state.public.wallet, [])
    //********//
})

test.serial('test getBalance', async (t) => {
    const data = cloneDeep(getMockedData())
    //********//
    data.state.public.wallet = [
        {
            primary: "ETH",
            quantity: 5
        }
    ]
    data.request.body = {
        as: "USDT"
    }
    let response = (await getBalanceAs(data)).response
    t.deepEqual(data.response.body, {
        success: true, 
        data: response.body.data
    })
    //********//
})