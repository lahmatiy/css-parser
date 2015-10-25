var isIdent = require('../checker/ident.js');
var readSpacesAndComments = require('./spacesAndComments.js');

module.exports = function readDeclaration(tokens, start, end) {
    var name = null;
    var preHack = null;
    var postHack = null;

    loop:
    for (var pos = start; pos < end; pos++) {
        var spaces = readSpacesAndComments(tokens, start, end);

        if (spaces) {
            pos += spaces;
            if (pos >= end) {
                break;
            }
        }

        var token = tokens[pos];

        switch (token) {
            case ':':
            case ';':
            case '}':
                pos--;
                break loop;

            default:
                if (isIdent(token) && !name) {
                    name = token;
                } else {
                    if (!name) {
                        preHack = preHack ? preHack + token : token;
                    } else {
                        postHack = postHack ? postHack + token : token;
                    }
                }
        }
    }

    if (!name) {
        return null;
    }

    return {
        type: 'property',
        start: start,
        end: pos,

        name: name,
        preHack: preHack,
        postHack: postHack
    };
};
