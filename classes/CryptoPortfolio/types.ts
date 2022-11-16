import { z } from 'zod'

export const upsertTokenInput = z.object({
    primary: z.string(),
    quantity: z.number()
})

export const reduceTokenInput = z.object({
    primary: z.string(),
    quantity: z.number(),
})

export const alarm = z.object({
    id: z.string(),
    coinName: z.string(),
    lowerLimit: z.boolean(),
    threshold: z.number()
})

export const coin = z.object({
    primary: z.string(),
    secondary: z.string(),
    quantity: z.number().optional(),
    price: z.string().optional(),
})

export const wallet = coin.array()

export const publicState = z.object({
    wallet: wallet
})

// TODO public state has its own type
export type Wallet = z.infer<typeof wallet>

export type Coin = z.infer<typeof coin>
export type UpsertTokenInput = z.infer<typeof upsertTokenInput> // TODO naming change this
export type ReduceTokenInput = z.infer<typeof reduceTokenInput>
export type Alarm = z.infer<typeof alarm>