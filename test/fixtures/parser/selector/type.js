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
            length: 0,
            start: 3
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
                                    type: 'type-selector',
                                    start: 0,
                                    length: 1,
                                    value: 'span'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
