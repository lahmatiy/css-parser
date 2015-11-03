var spaces = /^\s/;

module.exports = function checkSpaces(token) {
    return spaces.test(token);
};
