var tokenize = require('./tokenize.js');
var readStylesheet = require('./layout/stylesheet.js');

var N = 10;                    // \n
var F = 12;                    // \f
var R = 13;                    // \r
var STAR = 32;                 // *
var SLASH = 47;                // /
var SEMICOLON = 59;            // ;
var AT = 64;                   // @
var OPENING_CURLY = 123;       // {
var CLOSING_CURLY = 125;       // }
var OPENING_BRACE = 40;        // (
var CLOSING_BRACE = 41;        // )
var OPENING_SQUARE_BRACE = 91; // [
var CLOSING_SQUARE_BRACE = 93; // ]

function translateFragments(nodes, tokens) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (typeof node == 'string') {
            continue;
        }

        if (node.type !== 'stylesheet') {
            if ('start' in node) {
                node.source = tokens.slice(node.start, node.start + node.length).join('');
            } else if ('value' in node) {
                node.source = node.value;
            }
        }

        for (var key in node) {
            if (node[key]) {
                if (Array.isArray(node[key])) {
                    translateFragments(node[key], tokens);
                } else if (typeof node[key] === 'object') {
                    translateFragments([node[key]], tokens);
                    // node[key].source = tokens.slice(node[key].start, node[key].end).join('');
                }
            }
        }
    }
}

function closeBalance(balance, pos, end) {
    while (pos !== end) {
        var tmp = balance[pos];
        balance[pos] = end;
        openPos = tmp;
    }
}

function buildMapWithPositions(tokens, line, column) {
    var count = tokens.length + 1;
    var lines = new Uint32Array(count);
    var columns = new Uint32Array(count);
    var codes = new Uint32Array(count);
    var balance = new Uint32Array(count);
    var stackCode = [];
    var openPos = count;
    var charCode = 0;
    var nextCharCode = 0;
    var token = '';
    var tokenLength = 0;
    var tmp = 0;

    lines[0] = line;
    columns[0] = column;
    balance[0] = count;

    for (var i = 1; i < count; i++) {
        token = tokens[i - 1];
        tokenLength = token.length;
        column += tokenLength;
        charCode = 0;
        balance[i - 1] = count;

        for (var j = tokenLength - 1, wasLineBreak = false; j >= 0; j--) {
            nextCharCode = charCode;
            charCode = token.charCodeAt(j);

            // NOTE: don't change order in (nextCharCode && charCode) expression,
            // since V8 would deoptimize function as can't collect type info for nextCharCode
            if (charCode === N ||  // \n
               (nextCharCode !== N && charCode === R) ||  // \r but not followed by \n
                charCode === F) {  // \f

                if (!wasLineBreak) {
                    column = tokenLength - j;
                }

                wasLineBreak = true;
                line++;
            }
        }

        switch (charCode) {
            case CLOSING_CURLY:
                if (openPos !== count && codes[openPos] === OPENING_CURLY) {
                    tmp = balance[openPos];
                    balance[openPos] = i - 1;
                    openPos = tmp;
                }

                break;

            case CLOSING_BRACE:
                if (openPos !== count && codes[openPos] === OPENING_BRACE) {
                    tmp = balance[openPos];
                    balance[openPos] = i - 1;
                    openPos = tmp;
                }

                break;

            case CLOSING_SQUARE_BRACE:
                if (openPos !== count && codes[openPos] === OPENING_SQUARE_BRACE) {
                    tmp = balance[openPos];
                    balance[openPos] = i - 1;
                    openPos = tmp;
                }

                break;

            case OPENING_CURLY:
            case OPENING_BRACE:
            case OPENING_SQUARE_BRACE:
                if (openPos !== count) {
                    balance[i - 1] = openPos;
                }

                openPos = i - 1;

                break;
        }

        codes[i - 1] = charCode;
        lines[i] = line;
        columns[i] = column;
    };

    closeBalance(balance, openPos, count);

    return {
        tokens: tokens,
        codes: codes,
        lines: lines,
        columns: columns,
        balance: balance
    };
}

function buildMap(tokens) {
    var count = tokens.length;
    var codes = new Uint32Array(count);

    for (var i = 0; i < count; i++) {
        codes[i] = tokens[i].charCodeAt(0);
    };

    return {
        tokens: tokens,
        codes: codes
    };
}

function strintf() {
    var params = Array.prototype.slice.call(arguments);
    var str = params.shift();

    return str.replace(/%d/g, function() {
        return params.shift();
    });
}

module.exports = function parse(source, options) {
    var stat = [];

    if (!options) {
        options = {};
    }

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

    if (options.stat) {
        var time = process.hrtime();
        var mem = process.memoryUsage().heapUsed;
    }

    var tokens = tokenize(source).tokens;
    // console.log(tokens.length, tokens);

    if (options.stat) {
        var timeDiff = process.hrtime(time);
        stat.push(strintf(
            'tokenize    mem: +%d, time: %dms (%d tokens)',
            process.memoryUsage().heapUsed - mem,
            parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10),
            tokens.length
        ));
    }

    // =========================
    // pos

    if (options.stat) {
        var time = process.hrtime();
        var mem = process.memoryUsage().heapUsed;
    }

    var map = true || options.sourceMap
        ? buildMapWithPositions(tokens, 1, 1)
        : buildMap(tokens);
    // console.log(map);

    if (options.stat) {
        var timeDiff = process.hrtime(time);
        stat.push(strintf(
            'position    mem: +%d, time: %dms',
            process.memoryUsage().heapUsed - mem,
            parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
        ));
    }

    // ================
    // build ast

    if (options.stat) {
        var time = process.hrtime();
        var mem = process.memoryUsage().heapUsed;
    }

    var ast = readStylesheet(map, 0, tokens.length, false);

    if (options.stat) {
        var timeDiff = process.hrtime(time);
        stat.push(strintf(
            'ast         mem: +%d, time: %dms',
            process.memoryUsage().heapUsed - mem,
            parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
        ));
    }

    if (options.translateFragments) {
        translateFragments([ast], tokens);
    }

    // console.log(map.tokens.length, JSON.stringify(map.tokens));
    // console.log(JSON.stringify(Array.prototype.slice.call(map.lines)));
    // console.log(JSON.stringify(Array.prototype.slice.call(map.columns)));
    // console.log(JSON.stringify(Array.prototype.slice.call(map.codes)));
    // console.log(JSON.stringify(Array.prototype.slice.call(map.balance)));
    // console.log(JSON.stringify(ast, 0, 2));

    if (options.stat) {
        ast.stat = stat;
    }

    return ast;
};
