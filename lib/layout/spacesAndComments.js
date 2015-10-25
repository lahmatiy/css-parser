var readSpaces = require('./spaces.js');

module.exports = function readSpaceAndComments(tokens, start) {
    for (var pos = start; pos < tokens.length; pos++) {
        var token = tokens[pos];

        if (!readSpaces(tokens, pos) &&
            token.charAt(0) !== '/' &&
            token.charAt(1) !== '*') {
            break;
        }
    }

    return pos - start;
};
