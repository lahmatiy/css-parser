var readSpaceAndComments = require('./spacesAndComments.js');
var readSpaces = require('./spaces.js');
var readRuleset = require('./ruleset.js');
var readAtRule;

module.exports = function readStylesheet(tokens, start, end, nested) {
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

        var token = tokens[pos];

        if (nested && token === '}') {
            pos += 1 + readSpaces(tokens, pos, end);
            break;
        } else if (token === ';') {
            // temporary solution
            // attach to last token or to stylesheet
            pos++;
            buffer.push(token);
        } else if (token.length > 1 && token.charAt(0) === '@') {
            // lazy module init as recursive dependancy
            // TODO: find the way to do it better
            if (!readAtRule) {
                readAtRule = require('./atrule.js');
            }

            if (rule = readAtRule(tokens, pos, end)) {
                pos = rule.end + 1;
                buffer.push(rule);
            } else {
                throw new Error('Expected for at-rule');
            }
        } else {
            if (rule = readRuleset(tokens, pos, end)) {
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
