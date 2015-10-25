module.exports = function readBlock(tokens, start, end) {
    var stack = [];

    loop:
    for (var pos = start; pos < end; pos++) {
        var token = tokens[pos];

        switch (token) {
            case '}':
                if (!stack.length) {
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
