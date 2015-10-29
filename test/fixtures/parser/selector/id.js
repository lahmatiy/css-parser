module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 4,
    content: {
        type: 'ruleset',
        start: 0,
        length: 4,
        next: null,
        block: {
            type: 'block',
            content: null,
            start: 3,
            length: 0
        },
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
                                    type: 'id-selector',
                                    start: 0,
                                    length: 1,
                                    value: 'id'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
