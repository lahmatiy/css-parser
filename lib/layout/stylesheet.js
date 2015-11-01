var readRuleset = require('./ruleset');
var readAtRule; // lazy init as readArRule uses readStylesheet

var SEMICOLON = 59;            // ;
var CLOSING_CURLY = 125;       // }
var AT = 64;                   // @
var SLASH = 47;                // /

module.exports = function readStylesheet(map, start, end, nested) {
    var codes = map.codes;
    var head = null;
    var tail = null;
    var node;

    loop:
    for (var pos = start; pos < end;) {
        var firstCharCode = codes[pos];

        if (firstCharCode === SLASH && map.tokens[pos].length > 1) {
            node = {
                type: 'comment',
                start: pos,
                length: 1,
                next: null
            };
        } else {
            switch (firstCharCode) {
                case CLOSING_CURLY:
                    pos++;

                    if (nested) {
                        break loop;
                    }

                    if (node) {
                        node.length++;
                    }

                    continue;

                case SEMICOLON:
                    pos++;

                    if (node) {
                        node.length++;
                    }

                    continue;

                case AT:
                    // lazy module init as recursive dependancy
                    // TODO: find the way to do it better
                    if (!readAtRule) {
                        readAtRule = require('./atrule.js');
                    }

                    node = readAtRule(map, pos, end);

                    break;

                default:
                    node = readRuleset(map, pos, end);
            }
        }

        pos += node.length;

        if (tail) {
            tail.next = node;
        } else {
            head = node;
        }

        tail = node;
    }

    return {
        type: 'stylesheet',
        start: start,
        length: pos - start,

        content: head
    };
};
