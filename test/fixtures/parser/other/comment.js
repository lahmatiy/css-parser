module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 12,
    content: {
        type: 'comment',
        start: 0,
        length: 1,
        next: {
            type: 'ruleset',
            start: 1,
            length: 4,
            next: {
                type: 'ruleset',
                start: 5,
                length: 5,
                next: {
                    type: 'comment',
                    start: 10,
                    length: 1,
                    next: {
                        type: 'comment',
                        start: 11,
                        length: 1,
                        next: null
                    }
                },
                selector: {
                    type: 'selector-group',
                    start: 5,
                    length: 3,
                    invalid: true,
                    content: [
                        {
                            type: 'selector',
                            start: 5,
                            length: 3,
                            invalid: true,
                            content: [
                                {
                                    type: 'simple-selector',
                                    start: 6,
                                    length: 1,
                                    invalid: false,
                                    content: [
                                        {
                                            type: 'type-selector',
                                            start: 6,
                                            length: 1,
                                            value: 'a'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                block: {
                    type: 'block',
                    start: 9,
                    length: 0,
                    content: null
                }
            },
            selector: {
                type: 'selector-group',
                start: 1,
                length: 2,
                invalid: false,
                content: [
                    {
                        type: 'selector',
                        start: 1,
                        length: 2,
                        invalid: false,
                        content: [
                            {
                                type: 'simple-selector',
                                start: 1,
                                length: 1,
                                invalid: false,
                                content: [
                                    {
                                        type: 'class-selector',
                                        start: 1,
                                        length: 1,
                                        value: 'a'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            block: {
                type: 'block',
                start: 4,
                length: 0,
                content: null
            }
        }
    }
};
