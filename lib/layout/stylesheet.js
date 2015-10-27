var readRuleset = require('./ruleset.js');
var readAtRule; // lazy init as readArRule uses readStylesheet
var chr = require('../chr');

module.exports = function readStylesheet(map, start, end, nested) {
    var tokens = map.tokens;
    var codes = map.codes;
    var content = [];
    var rule;

    loop:
    for (var pos = start; pos < end;) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case chr.CLOSING_CURLY:
                if (nested) {
                    pos++;
                    break loop;
                }

                if (rule) {
                    rule.end++;
                }

                pos++;

                continue;

            case chr.SEMICOLON:
                if (rule) {
                    rule.end++;
                }

                pos++;

                continue;

            case chr.AT:
                // lazy module init as recursive dependancy
                // TODO: find the way to do it better
                if (!readAtRule) {
                    readAtRule = require('./atrule.js');
                }

                rule = readAtRule(map, pos, end);

                break;

            default:
                rule = readRuleset(map, pos, end);
        }

        pos = rule.end + 1;
        content.push(rule);
    }

    return {
        type: 'stylesheet',
        content: content
    };
};
