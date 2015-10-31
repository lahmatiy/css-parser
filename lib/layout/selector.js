var SEMICOLON = 59;            // ;
var OPENING_CURLY = 123;       // {
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readSelector(map, start, end) {
    var codes = map.codes;

    for (var pos = start; pos < end; pos++) {
        var firstCharCode = codes[pos];

        if (firstCharCode === OPENING_CURLY ||
            firstCharCode === SEMICOLON) {
            break;
        }

        if (firstCharCode === OPENING_BRACE ||
            firstCharCode === OPENING_SQUARE_BRACE) {
            pos = map.balance[pos];
        }
    }

    return {
        type: 'selector',
        start: start,
        length: pos - start
    };
};
