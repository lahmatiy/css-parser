module.exports = function checkComment(token) {
    return token.length > 1 &&
           token.charAt(0) === '/' &&
           token.charAt(1) === '*';
};
