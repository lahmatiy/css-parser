var readBlock = require('./block');
var readStylesheet = require('./stylesheet');
var chr = require('../chr');

module.exports = function readAtRule(map, start, end) {
    var codes = map.codes;
    var name = map.tokens[start];
    var stack = [];
    var closeCode = -1;
    var block = null;
    var paramsEnd;
    var ruleEnd;

    loop:
    for (var pos = start + 2; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case chr.SEMICOLON:
                if (closeCode === -1) {
                    paramsEnd = pos - 1;
                    ruleEnd = pos;
                    break loop;
                }

                break;

            case chr.OPENING_CURLY:
                if (closeCode === -1) {
                    paramsEnd = pos - 1;
                    block = name === '@font-face'
                        ? readBlock(map, pos + 1, end)
                        : readStylesheet(map, pos + 1, end, true);

                    if (block.content.length) {
                        pos = block.content[block.content.length - 1].end + 1;
                    } else {
                        pos++;
                    }

                    if (pos < end && codes[pos] === chr.CLOSING_CURLY) {
                        pos++;
                    }

                    ruleEnd = pos < end ? pos : end - 1;

                    break loop;
                }

                break;

            case chr.OPENING_BRACE:
                if (closeCode !== -1) {
                    stack.push(closeCode);
                }

                closeCode = chr.CLOSING_BRACE;

                break;

            case chr.OPENING_SQUARE_BRACE:
                if (closeCode !== -1) {
                    stack.push(closeCode);
                }

                closeCode = chr.CLOSING_SQUARE_BRACE;

                break;

            case closeCode:
                closeCode = stack.length ? stack.pop() : -1;

                break;
        }
    }

    return {
        type: 'atrule',
        start: start,
        end: ruleEnd,
        paramsEnd: paramsEnd,

        name: name,
        block: block
    };
};
