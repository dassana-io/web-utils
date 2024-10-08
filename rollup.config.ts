import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json' assert { type: 'json' }
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const config = {
	external: [...Object.keys(pkg.dependencies), 'react', 'react-dom'],
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'esm'
		}
	],
	plugins: [
		resolve({ browser: true, preferBuiltins: false }),
		commonjs(),
		json(), // For moment-timezone
		typescript({
			exclude: [
				'src/__tests__/**',
				'rollup.config.ts',
				'setupTests.ts',
				'jest-setup.ts'
			]
		}),
		terser()
	]
}

export default config
