var tokenize = require('./tokenize.js');
var spaceRx = /\s/;

function simple(tokens) {
    function readIdent() {
        var token = tokens[pos];
        var code = token.charCodeAt(0);

        if ((code === 92) ||                // \
            (code >= 97 && code <= 122) ||  // 'a' .. 'z'
            (code >= 65 && code <= 90)) {   // 'A' .. 'Z'
            pos++;

            return {
                type: 'ident',
                value: token
            };
        }
    }

    function readSelector() {
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
    }

    function readBlock() {
        var start = pos;
        var stack = [];

        for (; pos < tokens.length; pos++) {
            var token = tokens[pos];

            switch (token) {
                case '}':
                    if (!stack.length) {
                        pos++;

                        readSpaces();

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
    }

    function readRuleset() {
        var start = pos;
        var selector = readSelector();
        var block = readBlock();

        if (!selector && !block) {
            // fail?
            return;
        }

        return {
            type: 'ruleset',
            selector: selector,
            block: block,
            start: start,
            end: pos
        };
    }

    function readAtRule() {
        var stack = [];
        var name = readIdent();
        var start = pos;

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
                        block = readBlock();
                    } else {
                        block = readStylesheet(true);
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
    }

    function readSpaces(get) {
        if (pos >= tokens.length) {
            return;
        }

        var start = pos;
        var token = tokens[pos];
        var firstChar = token.charAt(0);

        if (spaceRx.test(token)) {
            pos++;
        }

        if (pos !== start && get) {
            return tokens[start];
        }
    }

    function readSpaceAndComments(get) {
        var start = pos;

        for (; pos < tokens.length; pos++) {
            var token = tokens[pos];

            if (!spaceRx.test(token) &&
                token.charAt(0) !== '/' &&
                token.charAt(1) !== '*') {
                break;
            }
        }

        if (pos !== start && get) {
            return tokens.slice(start, pos);
        }
    }

    function readStylesheet(nested) {
        var start = pos;
        var buffer = [];

        while (pos < tokens.length) {
            var spaces = readSpaceAndComments(true);

            if (spaces) {
                buffer.push.apply(buffer, spaces);

                if (pos >= tokens.length) {
                    break;
                }
            }

            if (tokens[pos] === '@') {
                pos++;
                buffer.push(readAtRule());
            } else if (tokens[pos] === '}' && nested) {
                pos++;
                readSpaces();
                break;
            } else {
                buffer.push(readRuleset());
            }
        }

        return {
            type: 'stylesheet',
            content: buffer,
            start: start,
            end: nested ? pos - 1 : pos
        };
    }

    var pos = 0;
    var result;


    try {
        result = readStylesheet();
    } catch (e) {
        console.error(e);
    }

    return result;
}

module.exports = function parse(source, rule, _needInfo) {
    // source = '123456789012345/* asd */67890sdfa"1234567890"sdasddddddsasd"123456789012345678901234567890"asdasdasdasdasdasdasdasdasdadasd';

    // var s;
    // console.log('start', s = process.memoryUsage().heapUsed);
    // var time = process.hrtime();
    // var CHUNK_SIZE = 10096;
    // var count = Math.ceil(source.length / CHUNK_SIZE);
    // for (var i = 0, tail; i < count; i++) {
    //     var chunk = source.substr(CHUNK_SIZE * i, CHUNK_SIZE);
    //     var res = tokenize(tail ? tail + chunk : chunk, i !== count - 1);

    //     tail = res.tail;
    // }
    // var timeDiff = process.hrtime(time);
    // console.log(parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10));
    // console.log('tokenize', process.memoryUsage().heapUsed - s);
    // process.exit();

    // ================
    // tokenize

    var time = process.hrtime();
    var mem = process.memoryUsage().heapUsed;

    var tokens = tokenize(source).tokens;
    // var tokens = tokens.map(function(x) {
    //     return {
    //         type: 1,
    //         value: x
    //     };
    // });

    var timeDiff = process.hrtime(time);
    console.log(
        'tokenize    mem: +%d, time: %dms',
        process.memoryUsage().heapUsed - mem,
        parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
    );


    // ================
    // build ast

    var time = process.hrtime();
    var mem = process.memoryUsage().heapUsed;

    var ast = simple(tokens);

    var timeDiff = process.hrtime(time);
    console.log(
        'ast         mem: +%d, time: %dms',
        process.memoryUsage().heapUsed - mem,
        parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
    );

    function t(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            // if (!node) {
            //     console.log(nodes);
            // }

            if (typeof node == 'string') {
                continue;
            }

            if (node.type !== 'stylesheet') {
                if ('start' in node) {
                    node.str = tokens.slice(node.start, node.end).join('');
                } else if ('value' in node) {
                    node.str = node.value;
                }
            }

            for (var key in node) {
                if (node[key]) {
                    if (Array.isArray(node[key])) {
                        t(node[key]);
                    } else if (typeof node[key] === 'object') {
                        t([node[key]]);
                        // node[key].str = tokens.slice(node[key].start, node[key].end).join('');
                    }
                }
            }
        }
    }
    // t([ast]);
    // console.log(JSON.stringify(ast, 0, 2));
    // console.log(ast);

    return ast;
};
