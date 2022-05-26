import * as Jet from 'fs-jetpack'
import * as Path from 'path'
import * as P from 'ts-prime'
import chokidar from 'chokidar'
import liveServer from 'live-server'
import renderToString from 'preact-render-to-string'
import { generatePdfBase } from '../generatePDFContent'

export async function watchFile(file: string) {
	const tmpFolder = `/tmp/${P.uuidv4()}/`
	await Jet.dir(tmpFolder)
}

export async function servePDF(file: string) {
	process.env.LIVE_SERVER = 'true'
	const tmpFolder = `/tmp/${P.uuidv4()}/`
	await Jet.dir(tmpFolder)
	const run = async () => {
		const files = Object.keys(require.cache).filter((q) => q.startsWith(Path.dirname(Path.resolve(file))))
		for (const x of files) {
			delete require.cache[x]
		}
		const component = require(file)
		await Jet.writeAsync(Path.resolve(tmpFolder, 'index.html'), generatePdfBase(component.default))
	}
	const debounced = P.debounce(run, 100)
	const watcher = chokidar.watch(Path.dirname(file), {
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
console.log('as')
servePDF(Path.resolve(__dirname, './sample.tsx'))
