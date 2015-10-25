module.exports = function checkIdent(token) {
    var code = token.charCodeAt(0);

    return code === 92 ||                  // \
           code === 95 ||                  // _
           code === 45 ||                  // -
           (code >= 97 && code <= 122) ||  // 'a' .. 'z'
           (code >= 65 && code <= 90);     // 'A' .. 'Z'
};
