var isSpaces = require('../checker/spaces.js');
var isComment = require('../checker/comment.js');

module.exports = function readSpaceAndComments(tokens, start, end) {
    for (var pos = start; pos < end; pos++) {
        var token = tokens[pos];

        if (!isSpaces(token) && !isComment(token)) {
            break;
        }
    }

    return pos - start;
};
