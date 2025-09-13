function assert(context, message, code) {
    if(context) {
        const error = new Error(message);
        error.status = code;
        throw error;
    }
}

module.exports = assert;