var readSpaces = require('./spaces.js');

module.exports = function readBlock(tokens, pos) {
    var start = pos;
    var stack = [];

    for (; pos < tokens.length; pos++) {
        var token = tokens[pos];

        switch (token) {
            case '}':
                if (!stack.length) {
                    pos++;

                    if (readSpaces(tokens, pos)) {
                        pos++;
                    }

                    if (tokens[pos] === ';') {
                        pos++;
                    }

                    return {
                        type: 'block',
                        start: start,
                        end: pos
                    };
                };
                break;

            case '(':
            case '[':
                stack.push(token);
                break;

            case ')':
            case ']':
                var left = stack[stack.length - 1];

                if ((left === '(' && token === ')') ||
                    (left === '[' && token === ']')) {
                    stack.pop();
                }
                break;
        }
    }
};
