import { PDF } from '../pdf'

export default [
	PDF.page({
		content: (
			<>
				<h1 class={'bg-red-600'}>xcnbn</h1>
			</>
		),
		format: 'A5',
	}),
	PDF.page({
		content: (
			<>
				<h1 class={'bg-red-600'}>xcnbn</h1>
			</>
		),
		format: 'A4',
	}),
]
