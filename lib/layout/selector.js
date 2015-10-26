var SEMICOLON = 59;            // ;
var OPENING_CURLY = 123;       // {
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readSelector(map, start, end) {
    var stack = [];
    var codes = map.codes;

    loop:
    for (var pos = start; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case OPENING_CURLY:
            case SEMICOLON:
                if (!stack.length) {
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
    }

    return {
        type: 'selector',
        start: start,
        end: pos - 1
    };
};
