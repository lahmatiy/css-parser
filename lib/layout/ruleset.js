var readSelector = require('./selector');
var readBlock = require('./block');

var OPENING_CURLY = 123;       // {

module.exports = function readRuleset(map, start, end) {
    var pos = start;
    var selector = null;
    var block = null;

    if (selector = readSelector(map, pos, end)) {
        pos = selector.end + 1;

        if (map.codes[pos] === OPENING_CURLY) {
            pos++;

            if (block = readBlock(map, pos, end)) {
                if (block.content.length) {
                    pos = block.content[block.content.length - 1].end + 1;
                } else {
                    pos++;
                }
            }
        }
    }

    return {
        type: 'ruleset',
        start: start,
        end: pos < end ? pos : end - 1,

        selector: selector,
        block: block
    };
};
