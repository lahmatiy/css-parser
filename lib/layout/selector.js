var SEMICOLON = 59;            // ;
var OPENING_CURLY = 123;       // {
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readSelector(map, start, end) {
    var codes = map.codes;
    var stack = [];
    var closeCode = -1;

    loop:
    for (var pos = start; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case OPENING_CURLY:
            case SEMICOLON:
                if (closeCode === -1) {
                    break loop;
                }

                break;

            case OPENING_BRACE:
                if (closeCode !== -1) {
                    stack.push(closeCode);
                }

                closeCode = CLOSING_BRACE;

                break;

            case OPENING_SQUARE_BRACE:
                if (closeCode !== -1) {
                    stack.push(closeCode);
                }

                closeCode = CLOSING_SQUARE_BRACE;

                break;

            case closeCode:
                closeCode = stack.length ? stack.pop() : -1;

                break;
        }
    }

    return {
        type: 'selector',
        start: start,
        end: pos - 1
    };
};
