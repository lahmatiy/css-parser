var COMMENT = '\\/\\*(.|[\\r\\n])*?(\\*\\/|$)';
var DSTRING = '"(\\\\.|[^"])*?("|(?=\\n)|$)';
var SSTRING = '\'(\\\\.|[^\'])*?(\'|(?=\\n)|$)';
var SPACES = '\\s+';
var NUMBER = '\\d+|\\d*\\.\\d+';
var NONASCII = '[^\\0-\\237]';
var UNICODE = '\\\\[0-9a-f]{1,6}(\\r\\n|[ \\n\\r\\t\\f])?';
var ESCAPE = '(' + UNICODE + '|\\\\[^\\n\\r\\f0-9a-fA-F])';
var NMSTART = '([_a-z]|' + NONASCII + '|' + ESCAPE + ')';
var NMCHAR = '([_a-z0-9-]|' + NONASCII + '|' + ESCAPE + ')';
var IDENT = '-?' + NMSTART + NMCHAR + '*';
var NAME = NMCHAR + '+';
var HASH_OR_ATKEYWORD = '[#@]' + NAME;
// var HASH = '@' + NAME;
// var ATKEYWORD = '@' + NAME;
var ANY = '\\\\?.';

var TOKENS = new RegExp([
        COMMENT,
        DSTRING,
        SSTRING,
        SPACES,
        HASH_OR_ATKEYWORD,
        NUMBER,
        IDENT,
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
                if (tailLength > 3 &&
                    tail.charAt(tailLength - 2) === '*' &&
                    tail.charAt(tailLength - 1) === '/') {
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
