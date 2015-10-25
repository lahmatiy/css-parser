module.exports = function readSelector(tokens, start) {
    var stack = [];

    for (var pos = start; pos < tokens.length; pos++) {
        var token = tokens[pos];

        switch (token) {
            case '{':
            case ';':
                if (!stack.length) {
                    return {
                        type: 'selector',
                        start: start,
                        end: pos - 1
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
