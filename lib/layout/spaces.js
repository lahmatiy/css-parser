var isSpaces = require('../checker/spaces.js');

module.exports = function readSpaces(tokens, start, end) {
    if (start < end && isSpaces(tokens[start])) {
        return 1;
    }

    return 0;
};
