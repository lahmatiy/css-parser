var isComment = require('../../checker/comment');
var readSimpleSelector = require('./simple/index');

var N = 10;                    // \n
var F = 12;                    // \f
var R = 13;                    // \r
var COMMA = 44;                // ,
var WHITESPACE = 32;           //
var TILDE = 126;               // ~
var GREATER_THAN = 62;         // >
var PLUS = 43;                 // +
var SLASH = 47;                // /

module.exports = function(map, start, end) {
    var pos = start;
    var content = [];
    var isInvalid = false;
    var simpleSelector;
    var last;

    loop:
    while (pos <= end) {
        switch (map.codes[pos]) {
            case COMMA:
                break loop;
            case WHITESPACE:
            case R:
            case F:
            case N:
                ++pos;
                break;
            case SLASH:
                if (isComment(map.tokens[pos])) {
                    content.push({
                        type: 'comment',
                        start: pos,
                        length: 1
                    });
                } else {
                    isInvalid = true;
                }
                ++pos;
                break;
            case GREATER_THAN:
            case TILDE:
            case PLUS:
                if (!last || last.type === 'combinator') {
                    isInvalid = true;
                }

                last = {
                    type: 'combinator',
                    start: pos,
                    length: 1,
                    invalid: false,
                    value: map.tokens[pos++]
                };

                content.push(last);
                break;
            default:
                last = simpleSelector = readSimpleSelector(map, pos, end);
                if (simpleSelector) {
                    if (simpleSelector.invalid) {
                        isInvalid = true;
                    }
                    pos += simpleSelector.length;
                    content.push(simpleSelector);
                } else {
                    isInvalid = true;
                    ++pos;
                }
                break;
        }
    }

    if (last && last.type === 'combinator') {
        isInvalid = true;
    }

    if (!content.length) {
        return null;
    }

    return {
        type: 'selector',
        content: content,
        invalid: isInvalid,
        start: start,
        length: pos - start
    };
};
