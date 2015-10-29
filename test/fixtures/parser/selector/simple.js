module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 8,
    content: {
        type: 'ruleset',
        start: 0,
        length: 8,
        next: null,

        selector: {
            type: 'selector-group',
            start: 0,
            length: 2,
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
            start: 3,
            length: 4,
            content: {
                type: 'declaration',
                start: 3,
                length: 4,
                next: null
            }
        }
    }
};
