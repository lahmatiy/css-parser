var isSpaces = require('../checker/spaces');
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

    if (!nested) {
        if (isSpaces(map.tokens[start])) {
            head = tail = {
                type: 'spaces',
                start: start++,
                length: 1,
                next: null
            };
        }
    }

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
                    if (nested) {
                        break loop;
                    }

                    pos++;

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
                        readAtRule = require('./atrule');
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
