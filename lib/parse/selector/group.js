var readSelector = require('./index');

var COMMA = 44;                // ,
var WHITESPACE = 32;           //

/*
 var OPENING_BRACE = 40;        // (
 var CLOSING_BRACE = 41;        // )
 var DOLLAR = 36;               // $
*/

// https://gist.github.com/lahmatiy/c484f63ac48520a2a340

module.exports = function(map, start, end) {
    var pos = start;
    var selectors = [];
    var isInvalid = false;
    var isComma = false;
    var selector;

    while (pos <= end) {
        switch (map.codes[pos]) {
            case COMMA:
                if (!selectors.length) {
                    isInvalid = true;
                }

                isComma = true;

                ++pos;
                break;
            case WHITESPACE:
                ++pos;
                break;
            default:
                selector = readSelector(map, pos, end);
                if (selector) {
                    isComma = false;
                    if (selector.invalid) {
                        isInvalid = true;
                    }
                    selectors = selectors.concat(selector);
                    pos += selector.length;
                } else {
                    isInvalid = true;
                    ++pos;
                }
                break;
        }
    }

    if (isComma) {
        isInvalid = true;
    }

    return {
        type: 'selector-group',
        content: selectors,
        invalid: isInvalid,
        start: start,
        length: pos - start
    };
};
