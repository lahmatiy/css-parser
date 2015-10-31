var readRuleset = require('./ruleset');
var readAtRule; // lazy init as readArRule uses readStylesheet

var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var AT = 64;                   // @

module.exports = function readStylesheet(map, start, end, nested) {
    var codes = map.codes;
    var rule;
    var head = null;
    var tail = null;

    loop:
    for (var pos = start; pos < end;) {
        var firstCharCode = codes[pos];

        switch (firstCharCode) {
            case CLOSING_CURLY:
                pos++;

                if (nested) {
                    break loop;
                }

                if (rule) {
                    rule.length++;
                }

                continue;

            case SEMICOLON:
                pos++;

                if (rule) {
                    rule.length++;
                }

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

        pos += rule.length;

        if (tail) {
            tail.next = rule;
        } else {
            head = rule;
        }

        tail = rule;
    }

    return {
        type: 'stylesheet',
        start: start,
        length: pos - start,

        content: tail
    };
};
