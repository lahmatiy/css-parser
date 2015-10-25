var readSelector = require('./selector.js');
var readBlock = require('./block.js');

module.exports = function readRuleset(tokens, start) {
    var pos = start;
    var selector;
    var block;

    if (selector = readSelector(tokens, pos)) {
        pos = selector.end + 1;
        if (tokens[pos] === '{') {
            pos++;
        }
    }

    if (block = readBlock(tokens, pos)) {
        pos = block.end + 1;
    }

    if (!selector && !block) {
        // fail?
        return;
    }

    return {
        type: 'ruleset',
        selector: selector,
        block: block,
        start: start,
        end: pos
    };
};
