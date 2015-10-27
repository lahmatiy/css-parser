var chr = require('../chr');

module.exports = function readDeclaration(map, start, end) {
    var codes = map.codes;
    var pos = start;
    var stack = [];
    var closeCode = -1;

    loop:
    for (; pos < end; pos++) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case chr.SEMICOLON:
                if (closeCode === -1) {
                    break loop;
                }

                break;

            case chr.CLOSING_CURLY:
                if (closeCode === -1) {
                    pos--;
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
        type: 'declaration',
        start: start,
        end: pos
    };
};
