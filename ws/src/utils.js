function isValidResponse(response) {
    return (
        typeof response === 'object' &&
        response !== null &&
        Object.prototype.hasOwnProperty.call(response, 'type') &&
        Object.prototype.hasOwnProperty.call(response, 'gameId') &&
        Object.prototype.hasOwnProperty.call(response, 'uuid')
    );
}

export default isValidResponse;
