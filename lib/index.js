var tokenize = require('./tokenize.js');
var readStylesheet = require('./layout/stylesheet.js');

function translateFragments(nodes, tokens) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (typeof node == 'string') {
            continue;
        }

        if (node.type !== 'stylesheet') {
            if ('start' in node) {
                node.str = tokens.slice(node.start, node.end + 1).join('');
            } else if ('value' in node) {
                node.str = node.value;
            }
        }

        for (var key in node) {
            if (node[key]) {
                if (Array.isArray(node[key])) {
                    translateFragments(node[key], tokens);
                } else if (typeof node[key] === 'object') {
                    translateFragments([node[key]], tokens);
                    // node[key].str = tokens.slice(node[key].start, node[key].end).join('');
                }
            }
        }
    }
}

module.exports = function parse(source, options) {
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

    var time = process.hrtime();
    var mem = process.memoryUsage().heapUsed;

    var tokens = tokenize(source).tokens;
    // var lines = source.split(/\n/);
    // var tokens = tokens.map(function(x) {
    //     return {
    //         type: 1,
    //         value: x
    //     };
    // });

    if (options.stat) {
        var timeDiff = process.hrtime(time);
        console.log(
            'tokenize    mem: +%d, time: %dms',
            process.memoryUsage().heapUsed - mem,
            parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
        );
    }


    // ================
    // build ast

    var time = process.hrtime();
    var mem = process.memoryUsage().heapUsed;

    var ast = readStylesheet(tokens, 0, tokens.length, false);

    if (options.stat) {
        var timeDiff = process.hrtime(time);
        console.log(
            'ast         mem: +%d, time: %dms',
            process.memoryUsage().heapUsed - mem,
            parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
        );
    }

    if (options.translateFragments) {
        translateFragments([ast], tokens);
    }

    return ast;
};
