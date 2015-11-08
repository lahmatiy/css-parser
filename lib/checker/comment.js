var SLASH = 47;      // /
var ASTERISK = 42;   // *

module.exports = function checkComment(token) {
    return token.length > 1 &&
           token.charCodeAt(0) === SLASH &&
           token.charCodeAt(1) === ASTERISK;
};
