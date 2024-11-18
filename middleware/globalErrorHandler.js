const responseFormatter = require('../util/ResponseFormatter');

const globalErrorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json(
            responseFormatter(false, err.message)
        );
    }

    console.error('Unexpected Error:', err);
    res.status(500).json(
        responseFormatter(false, '서버 내부 오류')
    );
};

module.exports = globalErrorHandler;
