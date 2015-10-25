var assert = require('chai').assert;
var path = require('path');
var fs = require('fs');

var parser = require('../');

var fixturesPath = path.resolve(__dirname, 'fixtures');

describe('Parser', function() {

    fs.readdirSync(fixturesPath).forEach(function(pathEntry) {
        var inputFileName = path.resolve(fixturesPath, pathEntry);
        var ext = path.extname(inputFileName);

        if (ext !== '.css') {
            return;
        }

        it(pathEntry, function() {
            var input = fs.readFileSync(inputFileName, 'utf-8');
            var expected = require(inputFileName.replace(/\.css$/, '.js'));
            var actual = parser(input, {
                translateFragments: false
            });

            assert.deepEqual(actual, expected);
        });
    });

});
