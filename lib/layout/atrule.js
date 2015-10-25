var readIdent = require('./ident.js');
var readBlock = require('./block.js');
var readStylesheet = require('./stylesheet.js');

module.exports = function readAtRule(tokens, start, end) {
    var stack = [];
    var name = tokens[start];
    var block = null;
    var paramsEnd;
    var ruleEnd;

    loop:
    for (var pos = start + 2; pos < end; pos++) {
        var token = tokens[pos];

        switch (token) {
            case ';':
                if (!stack.length) {
                    paramsEnd = pos - 1;
                    ruleEnd = pos + 1;
                    break loop;
                }

                break;

            case '{':
                if (!stack.length) {
                    block = name === '@font-face'
                        ? readBlock(tokens, pos + 1, end)
                        : readStylesheet(tokens, pos + 1, end, true);

                    paramsEnd = pos - 1;
                    ruleEnd = block.end + 1;
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
        type: 'atrule',
        start: start,
        end: ruleEnd,

        name: name,
        params: {
            start: start + 2,
            end: paramsEnd
        },
        block: block
    };
};
