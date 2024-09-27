import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json' assert { type: 'json' }
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const config = {
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
			exclude: ['**/__tests__']
		}),
		terser()
	]
}

export default config
