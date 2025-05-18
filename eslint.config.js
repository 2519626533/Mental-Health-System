import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
  },
  rules: {
    'no-console': ['warn'],
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'style/max-len': ['error', { code: 100, ignoreStrings: true, ignoreUrls: true, ignoreComments: true }],
    'vue/html-self-closing': ['off'],
    'vue/singleline-html-element-content-newline': 'off',
    'antfu/top-level-function': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 4 },
      multiline: { max: 1 },
    }],
  },
})
