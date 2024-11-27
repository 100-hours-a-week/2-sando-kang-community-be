const ERROR_CODES = require('../exception/errors');

const validateFieldsWithoutFiles = (fields, body) => {
    if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body.');
    }

    fields.forEach((key) => {
       
        if (
            !Object.prototype.hasOwnProperty.call(body, key) || 
            body[key] === null || 
            body[key] === undefined || 
            body[key].toString().trim() === '' 
        ) {
            throw new Error(ERROR_CODES.MISSING_FIELDS(key));
        }
    });
};

module.exports = validateFieldsWithoutFiles;
