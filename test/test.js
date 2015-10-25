var assert = require('chai').assert;
var path = require('path');
var fs = require('fs');

var parse = require('../lib');
var tokenize = require('../lib/tokenize');

var fixturesPath = path.resolve(__dirname, 'fixtures');

function processPath(testPath, callback) {
    fs.readdirSync(testPath).forEach(function(pathEntry) {
        var inputFileName = path.resolve(testPath, pathEntry);
        var ext = path.extname(inputFileName);

        if (ext !== '.css') {
            return;
        }

        it(pathEntry, function() {
            var input = fs.readFileSync(inputFileName, 'utf-8');
            var expected = require(inputFileName.replace(/\.css$/, '.js'));

            assert.deepEqual(callback(input), expected);
        });
    });
}

describe('Tokenizer', function() {
    processPath(path.resolve(fixturesPath, 'tokenizer'), function(input) {
        return tokenize(input).tokens;
    });
});

describe('Parser', function() {
    processPath(path.resolve(fixturesPath, 'parser'), function(input) {
        return parse(input, {
            translateFragments: false
        });
    });
});
