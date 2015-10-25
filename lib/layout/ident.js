var isIdent = require('../checker/ident.js');

module.exports = function readIdent(tokens, start, end) {
    if (start < end) {
        var token = tokens[start];

        if (isIdent(token)) {
            return {
                type: 'ident',
                value: token
            };
        }
    }

    return null;
};
