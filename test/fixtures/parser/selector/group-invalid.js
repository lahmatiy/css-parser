module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 9,
    content: {
        type: 'ruleset',
        start: 0,
        length: 5,
        next: {
            type: 'ruleset',
            start: 5,
            length: 4,
            next: null,
            block: {
                type: 'block',
                start: 8,
                length:0 ,
                content: null
            },
            selector: {
                type: 'selector-group',
                start: 5,
                length: 2,
                invalid: true,
                content: [
                    {
                        type: 'selector',
                        start: 5,
                        length: 1,
                        invalid: false,
                        content: [
                            {
                                type: 'simple-selector',
                                start: 5,
                                length: 1,
                                invalid: false,
                                content: [
                                    {
                                        type: 'class-selector',
                                        start: 5,
                                        length: 1,
                                        value: 'something'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        block: {
            type: 'block',
            content: null,
            length: 0,
            start: 4
        },
        selector: {
            type: 'selector-group',
            start: 0,
            length: 3,
            invalid: true,
            content: [
                {
                    type: 'selector',
                    invalid: false,
                    start: 1,
                    length: 2,
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
                                    value: 'invalid'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
