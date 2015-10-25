var readSpaces = require('./spaces.js');

module.exports = function readSpaceAndComments(tokens, start, end) {
    for (var pos = start; pos < end; pos++) {
        var token = tokens[pos];

        if (!readSpaces(tokens, pos, end) &&
            token.charAt(0) !== '/' &&
            token.charAt(1) !== '*') {
            break;
        }
    }

    return pos - start;
};
