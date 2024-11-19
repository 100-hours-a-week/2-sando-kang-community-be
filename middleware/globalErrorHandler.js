const responseFormatter = require('../util/ResponseFormatter');

const globalErrorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json(
            responseFormatter(false, err.message)
        );
    }

    console.error('Unexpected Error:', err);
    res.status(50000).json(
        responseFormatter(false, 'internal_server_error')
    );
};

module.exports = globalErrorHandler;
