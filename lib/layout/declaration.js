var readSpacesAndComments = require('./spacesAndComments.js');

module.exports = function readDeclaration(tokens, start, end) {
    var stack = [];
    var pos = start + readSpacesAndComments(tokens, start, end);
    var hasNonSpace = false;

    loop:
    for (; pos < end; pos++) {
        var token = tokens[pos];

        switch (token) {
            case ';':
                if (!stack.length) {
                    break loop;
                }

                break;

            case '}':
                if (!stack.length) {
                    if (!hasNonSpace) {
                        return null;
                    }

                    pos--;
                    break loop;
                }

                break;

            case '(':
            case '[':
                stack.push(token);
                break;

            case ')':
            case ']':
                if (stack.length) {
                    var left = stack[stack.length - 1];

                    if ((left === '(' && token === ')') ||
                        (left === '[' && token === ']')) {
                        stack.pop();
                    }
                }

                break;
        }

        hasNonSpace = true;
    }

    return {
        type: 'declaration',
        start: start,
        end: pos
    };
};
