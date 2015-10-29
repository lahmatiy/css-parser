var COMMONDELIM = '[:,;{}\\[\\]()]\\s*';
var SPACES = '\\s+';
var NUMBER = '(\\d+|\\d*\\.\\d+)(%|[a-z]+)?';
var NONASCII = '[^\\0-\\237]';
var UNICODE = '\\\\[0-9a-f]{1,6}(\\r\\n|[ \\n\\r\\t\\f])?';
var ESCAPE = '(' + UNICODE + '|\\\\[^\\n\\r\\f0-9a-fA-F])';
var NMSTART = '([_a-z]|' + NONASCII + '|' + ESCAPE + ')';
var NMCHAR = '([_a-z0-9-]|' + NONASCII + '|' + ESCAPE + ')';
var IDENT = '-?' + NMSTART + NMCHAR + '*';
var NAME = NMCHAR + '+';
// var HASH = '#' + NAME;
// var ATKEYWORD = '@' + NAME;
var HASH_OR_ATKEYWORD = '[#@\\.]' + NAME;
var COMMENT = '\\/\\*(.|[\\r\\n])*?(\\*\\/\\s*|$)';
var DSTRING = '"(\\\\.|[^"])*?("|(?=\\n)|$)';
var SSTRING = '\'(\\\\.|[^\'])*?(\'|(?=\\n)|$)';
var ANY = '\\\\?.';

module.exports = {
    ident: new RegExp(IDENT, 'gi'),
    sstring: new RegExp(SSTRING, 'gi'),
    dstring: new RegExp(DSTRING, 'gi'),
    all: new RegExp([
        COMMONDELIM,
        HASH_OR_ATKEYWORD,
        NUMBER,
        IDENT,
        SPACES,
        COMMENT,
        DSTRING,
        SSTRING,
        ANY
    ].join('|'), 'gi')
};
