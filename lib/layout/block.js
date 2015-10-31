var readDeclaration = require('./declaration');

var CLOSING_CURLY = 125; // `}'

module.exports = function readBlock(map, start, end) {
    var codes = map.codes;
    var head = null;
    var tail = null;
    var declaration;

    for (var pos = start; pos < end;) {
        if (codes[pos] === CLOSING_CURLY) {
            break;
        }

        declaration = readDeclaration(map, pos, end);
        pos += declaration.length;

        if (tail) {
            tail.next = declaration;
        } else {
            head = declaration;
        }

        tail = declaration;
    }

    return {
        type: 'block',
        start: start,
        length: pos - start,

        content: head
    };
};
