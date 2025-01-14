class AppError extends Error {
    constructor(message, statusCode = 500, explanation = null) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = explanation || message; // Provide default explanation
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
