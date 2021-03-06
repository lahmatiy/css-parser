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

var IS_COMPLETE_COMMENT = /^\/\*.*\*\/\s*$/;
var TOKENS = new RegExp([
        COMMONDELIM,
        HASH_OR_ATKEYWORD,
        NUMBER,
        IDENT,
        SPACES,
        COMMENT,
        DSTRING,
        SSTRING,
        ANY
    ].join('|'), 'gi');

module.exports = function tokenize(string, pending) {
    if (!string) {
        return {
            tokens: [],
            tail: false
        };
    }

    var tokens = string.match(TOKENS);
    var tail = tokens[tokens.length - 1];
    var tailLength = tail.length;

    switch (tail.charAt(0)) {
        case '/':
            // check token is comment (starts with /*)
            if (tail.charAt(1) === '*') {
                // check comment is complete (ends with */)
                if (IS_COMPLETE_COMMENT.test(tail)) {
                    tail = false;
                }
            } else {
                tail = false;
            }
            break;

        case '\'':
            // check string is complete (ends with ') or malformed (ends with \n)
            if (tailLength > 1 &&
                (tail.charAt(tailLength - 1) === '\'' ||
                 tail.charAt(tailLength - 1) === '\n')) {
                tail = false;
            }
            break;

        case '\"':
            // check string is complete (ends with ") or malformed (ends with \n)
            if (tailLength > 1 &&
                (tail.charAt(tailLength - 1) === '\"' ||
                 tail.charAt(tailLength - 1) === '\n')) {
                tail = false;
            }
            break;

        default:
            // for others return tail only if not await for more input
            if (!pending) {
                tail = false;
            }
    }

    // if has tail, remove last token
    if (tail) {
        tokens.pop();
    }

    return {
        tokens: tokens,
        tail: tail
    };
};
