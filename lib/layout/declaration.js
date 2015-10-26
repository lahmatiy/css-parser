var readSpacesAndComments = require('./spacesAndComments.js');

var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readDeclaration(map, start, end) {
    var stack = [];
    var pos = start + readSpacesAndComments(map.tokens, start, end);
    var hasNonSpace = false;
    var codes = map.codes;

    loop:
    for (; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case SEMICOLON:
                if (!stack.length) {
                    break loop;
                }

                break;

            case CLOSING_CURLY:
                if (!stack.length) {
                    if (!hasNonSpace) {
                        return null;
                    }

                    pos--;
                    break loop;
                }

                break;

            case OPENING_BRACE:
            case OPENING_SQUARE_BRACE:
                stack.push(firstCharCode);
                break;

            case CLOSING_BRACE:
            case CLOSING_SQUARE_BRACE:
                if (stack.length) {
                    var left = stack[stack.length - 1];

                    if ((left === OPENING_BRACE && firstCharCode === CLOSING_BRACE) ||
                        (left === OPENING_SQUARE_BRACE && firstCharCode === CLOSING_SQUARE_BRACE)) {
                        stack.pop();
                    }
                }

                break;
        }

        hasNonSpace = true;
    }

    return {
        type: 'declaration',
        start: start,
        end: pos
    };
};
