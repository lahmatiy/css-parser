module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 7,
    content: {
        type: 'ruleset',
        start: 0,
        length: 7,
        next: null,

        block: {
            type: 'block',
            start: 6,
            length: 0,
            content: null
        },

        selector: {
            type: 'selector-group',
            start: 0,
            length: 5,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 2,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 0,
                            length: 1,
                            invalid: false,
                            content: [
                                {
                                    type: 'class-selector',
                                    start: 0,
                                    length: 1,
                                    value: 'test'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'selector',
                    start: 3,
                    length: 2,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 3,
                            length: 1,
                            invalid: false,
                            content: [
                                {
                                    type: 'class-selector',
                                    start: 3,
                                    length: 1,
                                    value: 'simple'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
