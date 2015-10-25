var readSpaceAndComments = require('./spacesAndComments.js');
var readSpaces = require('./spaces.js');
var readRuleset = require('./ruleset.js');
var readAtRule;

module.exports = function readStylesheet(tokens, pos, nested) {
    var start = pos;
    var buffer = [];

    while (pos < tokens.length) {
        var spaces = readSpaceAndComments(tokens, pos, true);

        if (spaces) {
            buffer.push.apply(buffer, spaces);
            pos += spaces.length;

            if (pos >= tokens.length) {
                break;
            }
        }

        if (tokens[pos] === '@') {
            // lazy module init as recursive dependancy
            // TODO: find the way to do it better
            if (!readAtRule) {
                readAtRule = require('./atrule.js');
            }

            if (rule = readAtRule(tokens, pos + 1)) {
                pos = rule.end;
                buffer.push(rule);
            } else {
                throw new Error('Expected for at-rule');
            }
        } else if (tokens[pos] === '}' && nested) {
            pos++;
            if (readSpaces(tokens, pos)) {
                pos++;
            }
            break;
        } else {
            if (rule = readRuleset(tokens, pos)) {
                pos = rule.end;
                buffer.push(rule);
            } else {
                throw new Error('Expected for rule');
            }
        }
    }

    return {
        type: 'stylesheet',
        content: buffer,
        start: start,
        end: nested ? pos - 1 : pos
    };
};
