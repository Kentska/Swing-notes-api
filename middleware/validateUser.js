const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(), // Minst 3 tecken, max 30
        password: Joi.string().min(6).required(), // Minst 6 tecken
    });

    return schema.validate(data);
};

module.exports = validateUser;