const ERROR_CODES = require('../exception/errors');

const validateFields = (fields, body) => {
    for (const [key, condition] of Object.entries(fields)) {
        if (!body[key] || body[key] === null) {
            throw new Error(ERROR_CODES.MISSING_FIELDS(key));
        }
        if (condition && !condition(body[key])) {
            throw new Error(ERROR_CODES.INVALID_FIELDS(key));
        }
    }
};

module.exports = validateFields;