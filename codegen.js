/* eslint-disable */
const fs = require('fs')
const npm = require('npm')

if (fs.existsSync('global')) {
	npm.load(() => {
		npm.run('api-models:global')
	})
}
