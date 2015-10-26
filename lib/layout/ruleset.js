var readSelector = require('./selector.js');
var readBlock = require('./block.js');

var OPENING_CURLY = 123;       // {

module.exports = function readRuleset(map, start, end) {
    var pos = start;
    var selector;
    var block;

    if (selector = readSelector(map, pos, end)) {
        pos = selector.end + 1;
        if (map.codes[pos] === OPENING_CURLY) {
            pos++;
        }
    }

    if (block = readBlock(map, pos, end)) {
        pos = block.end + 1;
    }

    if (!selector && !block) {
        // fail?
        return null;
    }

    return {
        type: 'ruleset',
        start: start,
        end: pos,

        selector: selector,
        block: block
    };
};
