var YUI_config = {
        combine: false,
        base: 'js/yui/',
        groups: {
            'oauth': {
                base: 'js/oauth/',
                modules: {
                    'auth': {
                        path: 'auth.js',
                        requires: ['node']
                    }
                }
            },
            'setup': {
                base: 'js/setup',
                modules: 'configger'
            }
        }
    };