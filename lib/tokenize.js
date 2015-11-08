var tokensRegexp = require('./tokens');

var IS_COMPLETE_COMMENT = /^\/\*.*\*\/\s*$/;

module.exports = function tokenize(string, pending) {
    if (!string) {
        return {
            tokens: [],
            tail: false
        };
    }

    var tokens = string.match(tokensRegexp.all);
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
