module.exports = {
  extends: [
    '@smartx/eslint-config-tentative/vue'
  ],
  parserOptions: { parser: 'babel-eslint' },
  globals: {

  },
  rules: {
    'no-return-assign': 'off', // 允许return中使用赋值操作
    'no-sequences': 'off', // Array.reduce中使用逗号运算符
  },
}