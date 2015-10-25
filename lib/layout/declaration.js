var readSpacesAndComments = require('./spacesAndComments.js');

module.exports = function readDeclaration(tokens, start, end) {
    var hasNonSpace = false;
    var pos = start + readSpacesAndComments(tokens, start, end);

    for (; pos < end; pos++) {
        var token = tokens[pos];

        if (token === '}') {
            if (!hasNonSpace) {
                return null;
            }

            pos--;
            break;
        }

        if (token === ';') {
            break;
        }

        hasNonSpace = true;
    }

    return {
        type: 'declaration',
        start: start,
        end: pos
    };
};
