var readSpaces = require('./spaces.js');

module.exports = function readSpaceAndComments(tokens, pos, get) {
    var start = pos;

    for (; pos < tokens.length; pos++) {
        var token = tokens[pos];

        if (!readSpaces(tokens, pos) &&
            token.charAt(0) !== '/' &&
            token.charAt(1) !== '*') {
            break;
        }
    }

    if (pos !== start && get) {
        return tokens.slice(start, pos);
    }

    return start - pos;
};
