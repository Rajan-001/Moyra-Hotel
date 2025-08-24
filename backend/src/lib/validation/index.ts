import z from "zod"

export const userSchema=z.object({
    name:z.string().min(4),
    password:z.string().min(4)
})

export const hotelSchema=z.object({
    name:z.string().min(4)
})

