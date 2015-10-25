var tokenize = require('./tokenize.js');
var readStylesheet = require('./layout/stylesheet.js');

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
    // var lines = source.split(/\n/);
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

    var ast = readStylesheet(tokens, 0, tokens.length, false);

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
                    node.str = tokens.slice(node.start, node.end + 1).join('');
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
