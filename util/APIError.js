class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor); 
    }
}
module.exports = APIError;