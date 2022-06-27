import * as Jet from 'fs-jetpack'
import path, * as Path from 'path'
import * as P from 'ts-prime'
import chokidar from 'chokidar'
import liveServer from 'live-server'
import { generatePdfBase } from '@barbora-express/pdf-components'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { register } from 'ts-node'
register()

function packageJson() {
	let path = 'package.json'
	for (const index of P.range(1, 50)) {
		const r = Jet.exists(path)
		if (r) {
			return path
		}
		const f = P.range(0, index)
			.map(() => '../')
			.join('')

		path = Path.resolve(f, 'package.json')
	}
	throw new Error('Failed to find package.json')
}
export function root() {
	return path.dirname(packageJson())
}

export async function servePDF() {
	const args = await yargs(hideBin(process.argv))
		.option('file', {
			alias: 'v',
			type: 'string',
		})
		.parse(process.argv)
	if (args.file == null) {
		console.log('Please provide --file argument')
		process.exit(1)
	}
	const file = path.resolve(args.file)
	process.env.LIVE_SERVER = 'true'
	const tmpFolder = `/tmp/${P.uuidv4()}/`
	await Jet.dir(tmpFolder)
	const run = async () => {
		const files = Object.keys(require.cache).filter((q) => !q.includes('node_modules'))
		console.log(files)
		for (const x of files) {
			delete require.cache[x]
		}
		const component = require(file)
		await Jet.writeAsync(Path.resolve(tmpFolder, 'index.html'), generatePdfBase(component.default))
	}
	const debounced = P.debounce(run, 100)
	const watcher = chokidar.watch(Path.resolve(root(), 'src'), {
		ignored: /^\./,
		persistent: true,
	})
	watcher.on('add', debounced).on('change', run)
	liveServer.start({
		wait: 500,
		port: 8181, // Set the server port. Defaults to 8080.
		host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
		root: tmpFolder, // Set root directory that's being served. Defaults to cwd.
		open: true, // When false, it won't load your browser by default.
		file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	})
}

servePDF()
