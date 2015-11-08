module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 25,
    content: {
        type: 'ruleset',
        start: 0,
        length: 25,
        next: null,

        selector: {
            type: 'selector-group',
            start: 0,
            length: 2,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    invalid: false,
                    start: 0,
                    length: 2,
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
                }
            ]
        },
        block: {
            type: 'block',
            start: 3,
            length: 21,
            content: {
                type: 'declaration',
                start: 3,
                length: 17,
                next: {
                    type: 'declaration',
                    start: 20,
                    length: 4,
                    next: null
                }
            }
        }
    }
};
