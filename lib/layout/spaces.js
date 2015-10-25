var spaceRx = /^\s/;

module.exports = function readSpaces(tokens, start) {
    if (spaceRx.test(tokens[start])) {
        return 1;
    }

    return 0;
};
