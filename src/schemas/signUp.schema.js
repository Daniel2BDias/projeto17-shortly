import joi from "joi";

const signUpSchema = joi.object().keys({
    name: joi.string().trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().trim().required,
    confirmPassword: joi.string().trim().required().valid(joi.ref('password'))
});

export default signUpSchema;