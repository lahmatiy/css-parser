var readSpaceAndComments = require('./spacesAndComments.js');
var readSpaces = require('./spaces.js');
var readRuleset = require('./ruleset.js');
var readAtRule;

module.exports = function readStylesheet(tokens, start, nested) {
    var buffer = [];

    for (var pos = start; pos < tokens.length;) {
        var spaces = readSpaceAndComments(tokens, pos);

        if (spaces) {
            buffer.push.apply(buffer, tokens.slice(pos, pos + spaces));
            pos += spaces;

            if (pos >= tokens.length) {
                break;
            }
        }

        var token = tokens[pos];

        if (token === '@') {
            // lazy module init as recursive dependancy
            // TODO: find the way to do it better
            if (!readAtRule) {
                readAtRule = require('./atrule.js');
            }

            if (rule = readAtRule(tokens, pos)) {
                pos = rule.end + 1;
                buffer.push(rule);
            } else {
                throw new Error('Expected for at-rule');
            }
        } else if (token === '}' && nested) {
            pos += 1 + readSpaces(tokens, pos);
            break;
        } else if (token === ';') {
            // temporary solution
            // attach to last token or to stylesheet
            pos++;
            buffer.push(token);
        } else {
            if (rule = readRuleset(tokens, pos)) {
                pos = rule.end + 1;
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
        end: nested ? pos - 2 : pos
    };
};
