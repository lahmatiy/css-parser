var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readDeclaration(map, start, end) {
    var codes = map.codes;
    var pos = start;
    var stack = [];
    var closeCode = -1;

    loop:
    for (; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case SEMICOLON:
                if (closeCode === -1) {
                    pos++;
                    break loop;
                }

                break;

            case CLOSING_CURLY:
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
        type: 'declaration',
        start: start,
        length: pos - start
    };
};
