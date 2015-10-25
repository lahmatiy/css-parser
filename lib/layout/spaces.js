var spaceRx = /\s/;

module.exports = function readSpaces(tokens, pos, get) {
    if (pos >= tokens.length) {
        return;
    }

    var start = pos;
    var token = tokens[pos];
    var firstChar = token.charAt(0);

    if (spaceRx.test(token)) {
        if (get) {
            return tokens[pos];
        } else {
            return 1;
        }
    }

    return 0;
};
