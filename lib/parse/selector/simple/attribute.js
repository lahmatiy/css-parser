var isIdent = require('../../../checker/ident');
var isString = require('../../../checker/string');

var CLOSING_SQUARE_BRACE = 93; // ]
var VERTICAL_LINE = 124;       // |

module.exports = function(map, start, end) {
    var pos = start;
    var tokens = map.tokens;
    var codes = map.codes;
    var isInvalid = false;
    var token;
    var name = null;
    var value = null;
    var operator = null;
    var namespace = null;

    loop:
    while (pos < end) {
        switch (codes[pos]) {
            case CLOSING_SQUARE_BRACE:
                break loop;
            default:
                token = tokens[pos];

                if (!name) {
                    if (codes[pos] === VERTICAL_LINE) {
                        namespace = '';
                    } else
                    if (isIdent(token)) {
                        name = {
                            type: 'ident',
                            value: token,
                            namespace: namespace
                        };
                    } else {
                        isInvalid = true;
                    }
                    ++pos;
                    break;
                }

                if (!operator) {
                    if (token === '=') {
                        operator = token;
                        ++pos;
                    } else
                    if (pos < end && tokens[pos + 1] === '=' &&
                        (token === '~' ||
                            token === '|' ||
                            token === '^' ||
                            token === '$' ||
                            token === '*'
                        )
                    ) {
                        operator = token + tokens[pos + 1];
                        pos += 2;
                    } else
                    if (codes[pos] === VERTICAL_LINE) {
                        namespace = name.value;
                        name = null;
                        ++pos;
                    } else {
                        isInvalid = true;
                        ++pos;
                    }

                    break;
                }

                if (!value) {
                    if (isString(token)) {
                        value = {
                            type: 'string',
                            value: token
                        };
                    } else
                    if (isIdent(token)) {
                        value = {
                            type: 'ident',
                            value: token
                        };
                    } else {
                        isInvalid = true;
                    }
                    ++pos;
                    break;
                }

                isInvalid = true;
                break loop;
        }
    }

    return {
        type: 'attribute-selector',
        start: start - 1,
        length: pos - start + 2,
        name: name,
        operator: operator,
        value: value,
        invalid: isInvalid
    }
};
