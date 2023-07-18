/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	moduleDirectories: ['node_modules', 'src'],
	preset: 'ts-jest',
	roots: ['<rootDir>/src/'],
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^uuid$': require.resolve('uuid'),
		'^jsonpath-plus$': require.resolve('jsonpath-plus')
	}
}
