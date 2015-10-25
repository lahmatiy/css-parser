module.exports = function readSelector(tokens, pos) {
    var start = pos;
    var stack = [];

    for (; pos < tokens.length; pos++) {
        var token = tokens[pos];

        switch (token) {
            case '{':
            case ';':
                if (!stack.length) {
                    return {
                        type: 'selector',
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
