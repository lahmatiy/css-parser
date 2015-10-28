var readSelector = require('./selector');
var readBlock = require('./block');

var OPENING_CURLY = 123;       // {
var CLOSING_CURLY = 125;       // }

module.exports = function readRuleset(map, start, end) {
    var pos = start;
    var selector = null;
    var block = null;

    if (selector = readSelector(map, pos, end)) {
        pos += selector.length;

        if (map.codes[pos] === OPENING_CURLY) {
            pos++;

            if (block = readBlock(map, pos, end)) {
                pos += block.length;

                if (map.codes[pos] === CLOSING_CURLY) {
                    pos++;
                }
            }
        }
    }

    return {
        type: 'ruleset',
        start: start,
        length: pos - start,

        selector: selector,
        block: block
    };
};
