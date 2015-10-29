var assert = require('chai').assert;
var path = require('path');
var fs = require('fs');

var parse = require('../lib');
var tokenize = require('../lib/tokenize');

var fixturesPath = path.resolve(__dirname, 'fixtures');

function processPath(testPath, callback) {
    fs.readdirSync(testPath).forEach(function(pathEntry) {
        var searchPath = path.resolve(testPath, pathEntry);


        if (fs.statSync(searchPath).isDirectory()) {
            describe(pathEntry, function() {
                processPath(searchPath, callback);
            });
        } else {
            var ext = path.extname(searchPath);

            if (ext !== '.css') {
                return;
            }

            it(pathEntry, function() {
                var input = fs.readFileSync(searchPath, 'utf-8');
                var expected = require(searchPath.replace(/\.css$/, '.js'));
                var actual = callback(input.trim());

                assert.deepEqual(actual, expected);
            });
        }
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
        }).ast;
    });
});
