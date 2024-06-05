import joi from 'joi'

export const feeds = joi.object({
    body: joi.string()
    .required()
    .max(800)
})

export const users = joi.object({
    firstName:joi.string().
    required(),
    lastName:joi.string().
    required(),
    email:joi.string().email().
    required,
    password:joi.string().
    required(),
    username:joi.string().
    required(),
    dob:joi.string().required()
})