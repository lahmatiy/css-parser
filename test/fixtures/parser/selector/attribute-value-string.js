module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 9,
    content: {
        type: 'ruleset',
        start: 0,
        length: 9,
        next: null,
        block: {
            type: 'block',
            start: 8,
            length: 0,
            content: null
        },
        selector: {
            type: 'selector-group',
            start: 0,
            length: 7,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 7,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 0,
                            length: 7,
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
                                    length: 6,
                                    invalid: false,
                                    name: {
                                        type: 'ident',
                                        value: 'href',
                                        namespace: null
                                    },
                                    operator: '^=',
                                    value: {
                                        type: 'string',
                                        value: '"http:"'
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
