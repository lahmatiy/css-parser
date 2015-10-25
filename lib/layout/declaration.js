var readProperty = require('./property.js');
var readValue = require('./value.js');

module.exports = function readDeclaration(tokens, start, end) {
    var property = readProperty(tokens, start, end);
    var value = null;
    var pos;

    if (property) {
        pos = property.end + 1;

        if (pos < end && tokens[pos] === ':') {
            value = readValue(tokens, pos + 1, end);

            if (value) {
                pos = value.end + 1;

                if (pos < end && tokens[pos] === ';') {
                    pos++;
                }
            }
        }

        if (pos < end && tokens[pos] === '}') {
            pos--;
        }
    } else {
        return null;
    }

    return {
        type: 'declaration',
        start: start,
        end: pos,

        property: property,
        value: value
    };
};
