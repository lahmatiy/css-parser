module.exports = function readIdent(tokens, start, end) {
    var token = tokens[start];
    var code = token.charCodeAt(0);

    if ((code === 92) ||                // \
        (code >= 97 && code <= 122) ||  // 'a' .. 'z'
        (code >= 65 && code <= 90)) {   // 'A' .. 'Z'
        return {
            type: 'ident',
            value: token
        };
    }
};
