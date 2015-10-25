module.exports = function readValue(tokens, start, end) {
    var stack = [];

    loop:
    for (var pos = start; pos < end; pos++) {
        var token = tokens[pos];

        switch (token) {
            case ';':
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
                if (stack.length) {
                    var left = stack[stack.length - 1];

                    if ((left === '(' && token === ')') ||
                        (left === '[' && token === ']')) {
                        stack.pop();
                    }
                }

                break;
        }
    }

    if (pos === start) {
        return null;
    }

    return {
        type: 'value',
        start: start,
        end: pos
    };
};
