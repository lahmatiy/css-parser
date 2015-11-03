var readSelector = require('./selector.js');
var readBlock = require('./block.js');

var OPENING_CURLY = 123;       // {
var CLOSING_CURLY = 125;       // }

module.exports = function readRuleset(map, start, end) {
    var codes = map.codes;
    var pos = start;
    var selector = null;
    var block = null;

    if (selector = readSelector(map, pos, end)) {
        pos += selector.length;

        if (codes[pos] === OPENING_CURLY) {
            pos++;

            if (block = readBlock(map, pos, end)) {
                pos += block.length;

                if (codes[pos] === CLOSING_CURLY) {
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
        block: block,

        next: null
    };
};
