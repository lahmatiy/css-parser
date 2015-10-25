module.exports = function readBlock(tokens, start) {
    var stack = [];

    for (var pos = start; pos < tokens.length; pos++) {
        var token = tokens[pos];

        if (token === '}' && !stack.length) {
            pos--;
            break;
        }

        switch (token) {
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

    return {
        type: 'block',
        start: start,
        end: pos
    };
};
