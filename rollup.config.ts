import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const config = {
	external: [
		'axios',
		'axios-retry',
		'json-merge-patch',
		'jsonpath-plus',
		'lodash',
		'mitt',
		'moment-timezone',
		'react',
		'react-dom',
		'uuid'
	],
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'es'
		}
	],
	plugins: [
		resolve({ browser: true }),
		commonjs(),
		json(), // For moment-timezone
		typescript({
			useTsconfigDeclarationDir: true
		}),
		terser()
	]
}

export default config
