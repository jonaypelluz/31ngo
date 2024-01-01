module.exports = {
    env: {
        es6: true,
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
    overrides: [],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'vue/multi-word-component-names': 0,
        curly: 'error',
    },
};
