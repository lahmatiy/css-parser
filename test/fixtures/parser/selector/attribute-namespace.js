module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 10,
    content: {
        type: 'ruleset',
        start: 0,
        length: 10,
        next: null,
        block: {
            type: 'block',
            start: 9,
            length: 0,
            content: null
        },
        selector: {
            type: 'selector-group',
            start: 0,
            length: 8,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 8,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 0,
                            length: 8,
                            invalid: false,
                            content: [
                                {
                                    type: 'type-selector',
                                    start: 0,
                                    length: 1,
                                    value: 'a'
                                },
                                {
                                    type: 'attribute-selector',
                                    start: 1,
                                    length: 7,
                                    invalid: false,
                                    name: {
                                        type: 'ident',
                                        namespace: 'foo',
                                        value: 'bar'
                                    },
                                    operator: '=',
                                    value: {
                                        type: 'ident',
                                        value: 'baz'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
