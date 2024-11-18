class AppError extends Error {
    constructor(errorCode, message) {
        super(message || errorCode.code);
        this.statusCode = errorCode.status;
        this.errorCode = errorCode.code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
