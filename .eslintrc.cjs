/* eslint-env node */

module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'react-app',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react-hooks/recommended'
	],
	globals: {
		console: true,
		localStorage: true,
		module: true,
		window: true
	},
	ignorePatterns: ['*.test.*', '/src/api/*'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: true,
		tsconfigRootDir: __dirname
	},
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true }
		],
		'react-refresh/only-export-components': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'comma-dangle': ['warn', 'never'],
		'comma-spacing': ['warn', { after: true, before: false }],
		'key-spacing': [
			'warn',
			{
				afterColon: true,
				beforeColon: false
			}
		],
		'no-duplicate-imports': 'error',
		'no-useless-computed-key': 'warn',
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
	}
}
