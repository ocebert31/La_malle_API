function assert(context, message, code) {
    if(context) {
        const error = new Error(message);
        error.status = code;
        throw error;
    }
}

function validate(schema, data, customMessage = null, statusCode = 400) {
    const { error } = schema.validate(data);
    if (error) {
        const message = customMessage || error.details?.[0]?.message;
        assert(true, message, statusCode); 
    }
}

module.exports = {validate, assert}