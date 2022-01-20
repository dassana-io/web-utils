/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process')
const fs = require('fs')

if (fs.existsSync('globalJson')) {
	exec('npm run api-models:global')
}
