var readBlock = require('./block');
var readStylesheet = require('./stylesheet');

var SEMICOLON = 59;            // ;
var OPENING_CURLY = 123;       // {
var CLOSING_CURLY = 125;       // }
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readAtRule(map, start, end) {
    var codes = map.codes;
    var name = map.tokens[start];
    var paramsEnd = end;
    var block = null;

    for (var pos = start + 2; pos < end; pos++) {
        var firstCharCode = codes[pos];

        if (firstCharCode === SEMICOLON) {
            paramsEnd = pos;
            break;
        }

        if (firstCharCode === OPENING_CURLY) {
            paramsEnd = pos;

            block = name === '@font-face'
                ? readBlock(map, pos + 1, end)
                : readStylesheet(map, pos + 1, end, true);

            pos += block.length;

            if (codes[pos] === CLOSING_CURLY) {
                pos++;
            }

            break;
        }

        if (firstCharCode === OPENING_BRACE ||
            firstCharCode === OPENING_SQUARE_BRACE) {
            pos = map.balance[pos];
        }
    }

    return {
        type: 'atrule',
        start: start,
        length: pos - start,

        paramsEnd: paramsEnd - start,
        name: name,
        block: block,

        next: null
    };
};
