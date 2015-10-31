var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readDeclaration(map, start, end) {
    var codes = map.codes;
    var balance = map.balance;

    for (var pos = start; pos < end; pos++) {
        var firstCharCode = codes[pos];

        if (firstCharCode === SEMICOLON) {
            // include semicolon into declaration
            pos++;
            break;
        }

        if (firstCharCode === CLOSING_CURLY) {
            break;
        }

        if (firstCharCode === OPENING_BRACE ||
            firstCharCode === OPENING_SQUARE_BRACE) {
            pos = balance[pos];
        }
    }

    return {
        type: 'declaration',
        start: start,
        length: pos - start,
        next: null
    };
};
