import joi from "joi";

const loginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
});

export default loginSchema;