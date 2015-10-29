module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 5,
    content: {
        type: 'ruleset',
        start: 0,
        length: 5,
        next: null,
        block: {
            type: 'block',
            start: 4,
            length: 0,
            content: null
        },
        selector: {
            type: 'selector-group',
            start: 0,
            length: 3,
            invalid: false,
            content: [
                {
                    type: 'selector',
                    start: 0,
                    length: 3,
                    invalid: false,
                    content: [
                        {
                            type: 'simple-selector',
                            start: 0,
                            length: 2,
                            invalid: false,
                            content: [
                                {
                                    type: 'class-selector',
                                    start: 0,
                                    length: 1,
                                    value: 'some'
                                },
                                {
                                    type: 'class-selector',
                                    start: 1,
                                    length: 1,
                                    value: 'class'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
