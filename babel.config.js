// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
    env: {
        test: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-react',
            ],
            plugins: [
                '@babel/plugin-proposal-class-properties',
                'transform-es2015-modules-commonjs',
                'babel-plugin-dynamic-import-node',
                '@babel/plugin-transform-runtime',
            ],
        },
    },
};