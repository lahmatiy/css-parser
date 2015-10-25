var readSelector = require('./selector.js');
var readBlock = require('./block.js');

module.exports = function readRuleset(tokens, pos) {
    var start = pos;
    var selector;
    var block;

    if (selector = readSelector(tokens, pos)) {
        pos = selector.end;
    }

    if (block = readBlock(tokens, pos)) {
        pos = block.end;
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
