var spaceRx = /^\s/;

module.exports = function readSpaces(tokens, start, end) {
    if (start < end && spaceRx.test(tokens[start])) {
        return 1;
    }

    return 0;
};
