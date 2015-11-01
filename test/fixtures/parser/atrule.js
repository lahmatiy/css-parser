module.exports = {
    type: 'stylesheet',
    start: 0,
    length: 68,
    content: {
        type: 'atrule',
        start: 0,
        length: 4,
        paramsLength: 2,
        name: '@import',
        block: null,
        next: {
            type: 'atrule',
            start: 4,
            length: 26,
            paramsLength: 24,
            name: '@import',
            block: null,
            next: {
                type: 'atrule',
                start: 30,
                length: 15,
                paramsLength: 3,
                name: '@media',
                block: {
                    type: 'stylesheet',
                    start: 35,
                    length: 9,
                    content: {
                        type: 'ruleset',
                        start: 35,
                        length: 8,
                        selector: {
                            type: 'selector',
                            start: 35,
                            length: 2
                        },
                        block: {
                            type: 'block',
                            start: 38,
                            length: 4,
                            content: {
                                type: 'declaration',
                                start: 38,
                                length: 4,
                                next: null
                            }
                        },
                        next: null
                    }
                },
                next: {
                    type: 'comment',
                    start: 45,
                    length: 1,
                    next: {
                        type: 'atrule',
                        start: 46,
                        length: 22,
                        paramsLength: 3,
                        name: '@keyframes',
                        block: {
                            type: 'stylesheet',
                            start: 51,
                            length: 17,
                            content: {
                                type: 'ruleset',
                                start: 51,
                                length: 8,
                                selector: {
                                    type: 'selector',
                                    start: 51,
                                    length: 2
                                },
                                block: {
                                    type: 'block',
                                    start: 54,
                                    length: 4,
                                    content: {
                                        type: 'declaration',
                                        start: 54,
                                        length: 4,
                                        next: null
                                    }
                                },
                                next: {
                                    type: 'ruleset',
                                    start: 59,
                                    length: 8,
                                    selector: {
                                        type: 'selector',
                                        start: 59,
                                        length: 2
                                    },
                                    block: {
                                        type: 'block',
                                        start: 62,
                                        length: 4,
                                        content: {
                                            type: 'declaration',
                                            start: 62,
                                            length: 4,
                                            next: null
                                        }
                                    },
                                    next: null
                                }
                            }
                        },
                        next: null
                    }
                }
            }
        }
    }
};
