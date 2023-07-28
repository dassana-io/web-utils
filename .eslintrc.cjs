module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'standard-with-typescript',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended'
	],
	ignorePatterns: ['/src/api/*'],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		project: true,
		sourceType: 'module'
	},
	plugins: ['react'],
	rules: {
		'@typescript-eslint/brace-style': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/method-signature-style': 'off',
		'@typescript-eslint/no-confusing-void-expression': 'off',
		'@typescript-eslint/no-dynamic-delete': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/space-before-function-paren': 'off',
		'@typescript-eslint/strict-boolean-expressions': 'off',
		'@typescript-eslint/triple-slash-reference': 'off',
		'comma-dangle': ['warn', 'never'],
		'comma-spacing': ['warn', { after: true, before: false }],
		curly: ['error', 'multi-line', 'consistent'],
		'key-spacing': [
			'warn',
			{
				afterColon: true,
				beforeColon: false
			}
		],
		'multiline-ternary': 'off',
		'no-duplicate-imports': 'error',
		'no-tabs': 'off',
		'no-useless-computed-key': 'warn',
		'promise/param-names': 'off',
		'quote-props': ['warn', 'as-needed'],
		quotes: ['warn', 'single'],
		'react/display-name': 'off',
		'react/jsx-sort-props': 'warn',
		semi: ['warn', 'never'],
		'semi-spacing': ['warn', { after: true, before: false }],
		'sort-imports': [
			'warn',
			{
				ignoreCase: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple']
			}
		],
		'sort-keys': ['warn', 'asc'],
		'space-in-parens': ['warn', 'never']
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
