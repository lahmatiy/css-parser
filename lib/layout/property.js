var isSpaces = require('../checker/spaces.js');
var isComments = require('../checker/comment.js');

module.exports = function readDeclaration(tokens, start, end) {
    var hasNonSpace = false;

    for (var pos = start; pos < end; pos++) {
        var token = tokens[pos];

        if (token === '}' && !hasNonSpace) {
            return null;
        }

        if (token === ':' ||
            token === ';' ||
            token === '}') {
            pos--;
            break;
        }

        if (!isSpaces(token) && !isComments(token)) {
            hasNonSpace = true;
        }
    }

    return {
        type: 'property',
        start: start,
        end: pos
    };
};
