var tokenRegexps = require('../tokens');

module.exports = function checkIdent(token) {
    return token.match(tokenRegexps.ident);
};
