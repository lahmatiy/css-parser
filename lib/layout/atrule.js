var readIdent = require('./ident.js');
var readBlock = require('./block.js');
var readStylesheet = require('./stylesheet.js');

module.exports = function readAtRule(tokens, start) {
    var stack = [];
    var paramsEnd;
    var name = readIdent(tokens, start + 1);
    var block = null;

    if (!name) {
        throw new Error('At-rule name expected');
    }

    for (var pos = start + 2; pos < tokens.length; pos++) {
        var token = tokens[pos];

        if (!stack.length) {
            if (token === ';') {
                paramsEnd = pos - 1;
                pos++;
                break;
            } else if (token === '{') {
                block = name.value === 'font-face'
                    ? readBlock(tokens, pos + 1)
                    : readStylesheet(tokens, pos + 1, true);

                paramsEnd = pos - 1;
                pos = block.end + 1;

                break;
            }
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
        type: 'atrule',
        name: name,
        params: {
            start: start + 2,
            end: paramsEnd
        },
        block: block,
        start: start,
        end: pos
    };
};
