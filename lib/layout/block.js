var readSpacesAndComments = require('./spacesAndComments.js');
var readDeclaration = require('./declaration.js');

module.exports = function readBlock(tokens, start, end) {
    var pos = start;
    var declarations = [];
    var declaration;

    while (pos < end) {
        if (tokens[pos] === '}') {
            pos--;
            break;
        }

        if (declaration = readDeclaration(tokens, pos, end)) {
            declarations.push(declaration);
            pos = declaration.end + 1;
        } else {
            pos += readSpacesAndComments(tokens, pos, end);
        }
    }

    return {
        type: 'block',
        start: start,
        end: pos,

        declarations: declarations
    };
};
