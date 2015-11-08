var isIdent = require('../../../checker/ident');
var readAttributeSelector = require('./attribute');

var HASH = 35;                 // #
var POINT = 46;                // .
var OPENING_SQUARE_BRACE = 91; // [
var COLON = 58;                // :
var WHITESPACE = 32;           //
var COMMA = 44;                // ,
var ASTERISK = 42;             // *
var SLASH = 47;                // /

var pseudoElementsCompatibility = {
    'first-line': 1,
    'first-letter': 1,
    'before': 1,
    'after': 1
};

module.exports = function(map, start, end) {
    var pos = start;
    var codes = map.codes;
    var tokens = map.tokens;
    var content = [];
    var isInvalid = false;
    var selector;
    var token;

    loop:
    while (pos <= end) {
        switch (codes[pos]) {
            case SLASH:
                --pos;
                break;
            case WHITESPACE:
            case COMMA:
                break loop;
            case ASTERISK:
                content.push({
                    type: 'universal-selector',
                    start: pos,
                    length: 1
                });
                ++pos;
                break;
            case POINT:
                if (isIdent(tokens[pos])) {
                    content.push({
                        type: 'class-selector',
                        start: pos,
                        length: 1,
                        value: tokens[pos].substring(1)
                    });
                } else {
                    isInvalid = true;
                }
                ++pos;
                break;
            case HASH:
                content.push({
                    type: 'id-selector',
                    start: pos,
                    length: 1,
                    value: tokens[pos++].substring(1)
                });
                break;
            case COLON:
                // + () as func
                // For example, ::first-letter + span and ::first-letter em are invalid selectors
                // However, since ::shadow is defined to have internal structure, ::shadow > p is a valid selector.
                token = tokens[pos + 1];
                if (isIdent(token)) {
                    content.push({
                        type: 'pseudo-class',
                        value: token,
                        start: pos,
                        length: 1
                    });
                }
                pos += 2;
                break;
            case OPENING_SQUARE_BRACE:
                selector = readAttributeSelector(map, pos + 1, end);
                if (selector) {
                    if (selector.invalid) {
                        isInvalid = true;
                    }
                    content.push(selector);
                    pos += selector.length;
                } else {
                    isInvalid = true;
                    ++pos;
                }

                break;
            default:
                if (isIdent(tokens[pos])) {
                    content.push({
                        type: 'type-selector',
                        start: pos,
                        length: 1,
                        value: tokens[pos++]
                    });
                } else {
                    break loop;
                }
                break;
        }
    }

    if (!content.length) {
        return null;
    }

    return {
        type: 'simple-selector',
        start: start,
        length: pos - start,
        invalid: isInvalid,
        content: content
    };
};
