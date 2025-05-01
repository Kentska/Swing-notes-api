const Joi = require('joi');

const validateNote = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        content: Joi.string().min(5).max(300).required(),
    });

    return schema.validate(data);
};

module.exports = validateNote;