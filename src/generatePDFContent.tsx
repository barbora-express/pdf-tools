import renderToString from 'preact-render-to-string'
import { PDF } from './pdf'
import { HtmlDoc } from './components/html'

export function generatePdfBase(pages: PDF.Content[]) {
	return renderToString(<HtmlDoc pages={pages}></HtmlDoc>)
}
