var tokenRegexps = require('../tokens');

module.exports = function(token) {
    return token.match(tokenRegexps.dstring) ||
        token.match(tokenRegexps.sstring);
};
