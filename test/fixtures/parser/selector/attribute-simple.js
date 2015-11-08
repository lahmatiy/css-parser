module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 6,
    content: {
        type: 'ruleset',
        start: 0,
        length: 6,
        next: null,
        block: {
            type: 'block',
            start: 5,
            length: 0,
            content: null
        },
        selector: {
            type: 'selector-group',
            start: 0,
            length: 4,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 4,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 0,
                            length: 4,
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
                                    length: 3,
                                    invalid: false,
                                    name: {
                                        type: 'ident',
                                        value: 'href',
                                        namespace: null
                                    },
                                    operator: null,
                                    value: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
