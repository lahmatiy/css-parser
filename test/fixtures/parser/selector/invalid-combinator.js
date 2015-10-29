module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 12,
    content: {
        type: 'ruleset',
        start: 0,
        length: 6,
        next: {
            type: 'ruleset',
            start: 6,
            length: 6,
            next: null,
            block: {
                type: 'block',
                start: 11,
                length: 0,
                content: null
            },
            selector: {
                type: 'selector-group',
                start: 6,
                length: 4,
                invalid: true,
                content: [
                    {
                        type: 'selector',
                        start: 6,
                        length: 4,
                        invalid: true,
                        content: [
                            {
                                type: 'simple-selector',
                                start: 6,
                                length: 1,
                                invalid: false,
                                content: [
                                    {
                                        type: 'class-selector',
                                        start: 6,
                                        length: 1,
                                        value: 'something'
                                    }
                                ]
                            },
                            {
                                type: 'combinator',
                                start: 8,
                                length: 1,
                                invalid: false,
                                value: '>'
                            }
                        ]
                    }
                ]
            }
        },
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
            invalid: true,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 4,
                    invalid: true,
                    content: [
                        {
                            type: 'combinator',
                            value: '>',
                            start: 0,
                            length: 1,
                            invalid: false
                        },
                        {
                            type: 'simple-selector',
                            start: 2,
                            length: 1,
                            invalid: false,
                            content: [
                                {
                                    type: 'class-selector',
                                    start: 2,
                                    length: 1,
                                    value: 'something'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
