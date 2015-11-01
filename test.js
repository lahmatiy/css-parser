var path = require('path');
var fs = require('fs');
var tokenize = require('./lib/tokenize.js');
var parse = require('./lib/index.js');

var translateFragments = process.argv.indexOf('--translate') !== -1;
var printAst = process.argv.indexOf('--print') !== -1;
var sourceMap = process.argv.indexOf('--no-source-map') === -1;
var mem = process.memoryUsage().heapUsed;
console.log('\nbaseline    mem:  %d',
    mem
);

// var src = require('fs').readFileSync('../protools/web-frontend/build/agent/index-theme-app.css', 'utf-8');
// 13171 declarations, 4183 blocks
// var src = '/*\n  test\n*/\n .asd:nth-child(2n + 1) { color: rgba(255.2,255,255) /***/ url("sdf\\"dfsf") }';
var src = require('fs').readFileSync('./test.css', 'utf-8');
// var src = require('fs').readFileSync('./test/fixtures/parser/comment.css', 'utf-8');
console.log('read        mem: +%d (%d symbols)',
    process.memoryUsage().heapUsed - mem,
    src.length
);
console.log('-------------------------------');

// ===================
// main part

var time = process.hrtime();
var mem = process.memoryUsage().heapUsed;

// ///////////////
var result = parse(src, {
    stat: true,
    sourceMap: sourceMap,
    translateFragments: translateFragments
});
// console.log(tokenize('asd "sdfdsf\nasdasd'));
// ////////////////

var timeDiff = process.hrtime(time);
// console.log('>', res.tokens.length);
if (result.stat) {
    console.log(result.stat.join('\n'));
}

console.log(
    '-------------------------------\n' +
    'total       mem: +%d, time: %dms\n',
    process.memoryUsage().heapUsed - mem,
    parseInt(timeDiff[0] * 1e3 + timeDiff[1] / 1e6, 10)
);

if (printAst) {
    console.log(JSON.stringify(result.ast, 0, 2));
}
