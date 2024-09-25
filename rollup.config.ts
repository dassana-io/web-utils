import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json' assert { type: 'json' }
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const config = {
	external: [
		'axios',
		'axios-retry',
		'bytes',
		'date-fns',
		'date-fns-tz',
		'idb-keyval',
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
		typescript({ tsconfig: 'tsconfig.json' }),
		terser()
	]
}

export default config
