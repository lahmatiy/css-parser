var readSpaceAndComments = require('./spacesAndComments.js');
var readRuleset = require('./ruleset.js');
var readAtRule; // lazy init as readArRule uses readStylesheet

var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var AT = 64;                   // @

module.exports = function readStylesheet(map, start, end, nested) {
    var tokens = map.tokens;
    var codes = map.codes;
    var buffer = [];

    for (var pos = start; pos < end;) {
        var spaces = readSpaceAndComments(tokens, pos, end);

        if (spaces) {
            buffer.push.apply(buffer, tokens.slice(pos, pos + spaces));
            pos += spaces;

            if (pos >= end) {
                break;
            }
        }

        var firstCharCode = codes[pos];

        if (nested && firstCharCode === CLOSING_CURLY) {
            pos++;
            break;
        } else if (firstCharCode === SEMICOLON) {
            // temporary solution
            // attach to last token or to stylesheet
            pos++;
            buffer.push(tokens[pos]);
        } else if (firstCharCode === AT) {
            // lazy module init as recursive dependancy
            // TODO: find the way to do it better
            if (!readAtRule) {
                readAtRule = require('./atrule.js');
            }

            if (rule = readAtRule(map, pos, end)) {
                pos = rule.end + 1;
                buffer.push(rule);
            } else {
                throw new Error('Expected for at-rule');
            }
        } else {
            if (rule = readRuleset(map, pos, end)) {
                pos = rule.end + 1;
                buffer.push(rule);
            } else {
                throw new Error('Expected for rule');
            }
        }
    }

    return {
        type: 'stylesheet',
        start: start,
        end: nested ? pos - 2 : pos,

        content: buffer
    };
};
