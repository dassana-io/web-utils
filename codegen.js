/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process')
const fs = require('fs')

const apiServices = ['global', 'profile']

apiServices.forEach(service => {
	if (fs.existsSync(`${service}Api`)) {
		exec(`npm run api-models:${service}`)
	}
})
