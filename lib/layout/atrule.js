var readBlock = require('./block.js');
var readStylesheet = require('./stylesheet.js');

var SEMICOLON = 59;            // ;
var OPENING_CURLY = 123;       // {
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

module.exports = function readAtRule(map, start, end) {
    var stack = [];
    var name = map.tokens[start];
    var codes = map.codes;
    var block = null;
    var paramsEnd;
    var ruleEnd;

    loop:
    for (var pos = start + 2; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case SEMICOLON:
                if (!stack.length) {
                    paramsEnd = pos - 1;
                    ruleEnd = pos + 1;
                    break loop;
                }

                break;

            case OPENING_CURLY:
                if (!stack.length) {
                    block = name === '@font-face'
                        ? readBlock(map, pos + 1, end)
                        : readStylesheet(map, pos + 1, end, true);

                    paramsEnd = pos - 1;
                    ruleEnd = block.end + 1;
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
        type: 'atrule',
        start: start,
        end: ruleEnd,

        name: name,
        params: {
            start: start + 2,
            end: paramsEnd
        },
        block: block
    };
};
