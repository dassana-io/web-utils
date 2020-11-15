module.exports = {
	collectCoverageFrom: ['lib/**/*.{ts,tsx,js,jsx}'],
	coverageDirectory: 'coverage',
	preset: 'ts-jest',
	restoreMocks: true,
	testEnvironment: 'node'
}
