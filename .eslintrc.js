module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'eol-last': 'off',
    quotes: 'off',
    semi: 'off',
    'vue/html-self-closing': 'off',
    'space-before-function-paren': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    indent: 'off'
  }
}
