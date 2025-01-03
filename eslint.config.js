import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      // @ts-ignore
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // @ts-ignore
    rules: {
      ...reactHooks.configs.recommended.rules,
      /**
       * off表示关闭规则，也可以使用数字0代替
       * warn表示警告，也可以使用数字1代替
       * error表示错误，也可以使用数字2代替
       */
      "@typescript-eslint/explicit-module-boundary-types": "off",
      '@typescript-eslint/no-unused-vars': 'off',
      // 不使用var
      'no-var': 'error',
      // 没有console
      'no-console': 'warn',
      // 没有debugger
      'no-debugger': 'warn',
      // 没有alert
      'no-alert': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
