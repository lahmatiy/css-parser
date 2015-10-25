var spaceRx = /^\s/;

module.exports = function checkSpaces(token) {
    return spaceRx.test(token);
};
