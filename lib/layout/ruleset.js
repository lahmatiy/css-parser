var readSelector = require('./selector.js');
var readBlock = require('./block.js');

module.exports = function readRuleset(tokens, start, end) {
    var pos = start;
    var selector;
    var block;

    if (selector = readSelector(tokens, pos, end)) {
        pos = selector.end + 1;
        if (tokens[pos] === '{') {
            pos++;
        }
    }

    if (block = readBlock(tokens, pos, end)) {
        pos = block.end + 1;
    }

    if (!selector && !block) {
        // fail?
        return;
    }

    return {
        type: 'ruleset',
        start: start,
        end: pos,

        selector: selector,
        block: block
    };
};
