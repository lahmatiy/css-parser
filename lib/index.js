var tokenize = require('./tokenize');
var readStylesheet = require('./layout/stylesheet');

function translateFragments(nodes, tokens) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (typeof node == 'string') {
            continue;
        }

        if (node.type !== 'stylesheet') {
            if ('start' in node) {
                node.source = tokens.slice(node.start, node.end + 1).join('');
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

function buildMapWithPositions(tokens, line, column) {
    var count = tokens.length + 1;
    var lines = new Uint32Array(count);
    var columns = new Uint32Array(count);
    var codes = new Uint8Array(count);
    var charCode;
    var token;

    lines[0] = line;
    columns[0] = column;

    for (var i = 1; i < count; i++) {
        token = tokens[i - 1];

        for (var j = token.length - 1; j >= 0; j--) {
            charCode = token.charCodeAt(j);

            if (charCode === 10 ||  // \n
                charCode === 12) {  // \f
                line++;
                column = 1;
            } else {
                column++;
            }
        }

        codes[i - 1] = charCode;
        lines[i] = line;
        columns[i] = column;
    };

    return {
        tokens: tokens,
        codes: codes,
        lines: lines,
        columns: columns
    };
}

function buildMap(tokens) {
    var count = tokens.length;
    var codes = new Uint8Array(count);

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

    var map = options.sourceMap
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

    if (options.stat) {
        ast.stat = stat;
    }

    return ast;
};
