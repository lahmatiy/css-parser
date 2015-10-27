var readRuleset = require('./ruleset');
var readAtRule; // lazy init as readArRule uses readStylesheet

var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var AT = 64;                   // @

module.exports = function readStylesheet(map, start, end, nested) {
    var tokens = map.tokens;
    var codes = map.codes;
    var content = [];
    var rule;

    loop:
    for (var pos = start; pos < end;) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case CLOSING_CURLY:
                if (nested) {
                    pos++;
                    break loop;
                }

                if (rule) {
                    rule.end++;
                }

                pos++;

                continue;

            case SEMICOLON:
                if (rule) {
                    rule.end++;
                }

                pos++;

                continue;

            case AT:
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
