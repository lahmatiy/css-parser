var SLASH = 47;  // /
var STAR = 32;   // *

module.exports = function checkComment(token) {
    return token.length > 1 &&
           token.charCodeAt(0) === SLASH &&
           token.charCodeAt(1) === STAR;
};
