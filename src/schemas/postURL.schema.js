import joi from "joi";

const postUrlSchema = joi.object().keys({
    url: joi.string().uri().required()
});

export default postUrlSchema;