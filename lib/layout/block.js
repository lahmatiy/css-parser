var readSpacesAndComments = require('./spacesAndComments.js');
var readDeclaration = require('./declaration.js');

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

        if (declaration = readDeclaration(map, pos, end)) {
            declarations.push(declaration);
            pos = declaration.end + 1;
        } else {
            pos += readSpacesAndComments(map.tokens, pos, end);
        }
    }

    return {
        type: 'block',
        start: start,
        end: pos,

        declarations: declarations
    };
};
