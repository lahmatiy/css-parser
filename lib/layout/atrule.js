var readIdent = require('./ident.js');
var readBlock = require('./block.js');
var readStylesheet = require('./stylesheet.js');

module.exports = function readAtRule(tokens, pos) {
    var stack = [];
    var name = readIdent(tokens, pos);
    var start = ++pos;

    if (!name) {
        throw new Error('At-rule name expected');
    }

    for (; pos < tokens.length; pos++) {
        var token = tokens[pos];

        switch (token) {
            case ';':
                return {
                    type: 'atrule',
                    name: name,
                    any: {
                        start: start,
                        end: pos
                    },
                    block: null,
                    start: start,
                    end: pos
                };

            case '{':
                if (stack.length) {
                    stack.push(token);
                    break;
                }

                var block;
                var blockStart = pos++;

                if (name.value === 'font-face') {
                    if (block = readBlock(tokens)) {
                        pos = block.end;
                    }
                } else {
                    block = readStylesheet(tokens, pos, true);
                    block.start--;
                    block.end++;
                }

                return {
                    type: 'atrule',
                    name: name,
                    any: {
                        start: start,
                        end: blockStart - 1
                    },
                    block: block,
                    start: start,
                    end: pos
                };

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
