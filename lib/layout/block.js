var readDeclaration = require('./declaration');

var CLOSING_CURLY = 125; // `}'

module.exports = function readBlock(map, start, end) {
    var codes = map.codes;
    var pos = start;
    var declarations = [];
    var declaration;

    while (pos < end) {
        if (codes[pos] === CLOSING_CURLY) {
            pos--;
            break;
        }

        declaration = readDeclaration(map, pos, end);
        declarations.push(declaration);
        pos = declaration.end + 1;
    }

    return {
        type: 'block',
        content: declarations
    };
};
