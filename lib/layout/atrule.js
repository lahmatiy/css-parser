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
    var block = null;
    var paramsEnd;

    loop:
    for (var pos = start + 2; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case SEMICOLON:
                paramsEnd = pos;
                break loop;

            case OPENING_CURLY:
                paramsEnd = pos;
                block = name === '@font-face'
                    ? readBlock(map, pos + 1, end)
                    : readStylesheet(map, pos + 1, end, true);

                pos += block.length;

                if (codes[pos] === CLOSING_CURLY) {
                    pos++;
                }

                break loop;

            case OPENING_BRACE:
            case OPENING_SQUARE_BRACE:
                pos = map.balance[pos];
                break;
        }
    }

    return {
        type: 'atrule',
        start: start,
        length: pos - start,
        paramsEnd: paramsEnd - start,

        name: name,
        block: block
    };
};
