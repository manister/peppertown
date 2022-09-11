module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jsx-a11y'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:jsx-a11y/recommended', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-var-requires': 'off',
  },
}
