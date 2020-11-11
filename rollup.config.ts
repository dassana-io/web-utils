import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
	external: ['react', 'react-dom'],
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
		})
	]
}
