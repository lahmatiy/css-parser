var N = 10;  // \n
var F = 12;  // \f
var R = 13;  // \r
var S = 32;  // space
var spaceRx = /^\s/;

module.exports = function checkSpaces(token) {
    var fc = token.charCodeAt(0);
    return fc === S || fc === N || fc === R || fc === F;
};
