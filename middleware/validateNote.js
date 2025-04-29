const Joi = require('joi');

const validateNote = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        content: Joi.string().min(5).required(),
        userId: Joi.string().required(),
    });

    return schema.validate(data);
};

module.exports = validateNote;