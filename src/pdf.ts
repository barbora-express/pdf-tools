import * as P from 'ts-prime'
import * as Jet from 'fs-jetpack'
import { tmpNameSync } from 'tmp'
import { PDFDocument } from 'pdf-lib'
import { Content, flipDimensions } from '@barbora-express/pdf-components'

const html_to_pdf = require('html-pdf-node')

async function mergePDF(pdfList: Buffer[]) {
	const pdfToMerge = [...pdfList]

	const mergedPdf = await PDFDocument.create()
	for (const pdfBytes of pdfToMerge) {
		const pdf = await PDFDocument.load(pdfBytes)
		const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
		copiedPages.forEach((page) => {
			mergedPdf.addPage(page)
		})
	}

	const buffer = await mergedPdf.save()
	return buffer
}

async function singlePdf(content: Content) {
	const format = P.isArray(content.format)
		? {
				...flipDimensions(content.format, true),
		  }
		: {
				format: content.format,
		  }
	const result = await P.canFail(
		() =>
			html_to_pdf.generatePdf(
				{
					content: content.content,
				},
				{
					...format,
					landscape: content.landscape,
				}
			) as Promise<Buffer>
	)
	if (P.isError(result)) throw result
	return result
}

/**
 *
 * @returns {string} File to generated pdf file
 */
export async function generate(args: Content[], output?: string) {
	const sample = await Promise.all(args.map((c) => singlePdf(c)))
	const mergedPDF = await mergePDF(sample)
	const name = output ? Jet.path(process.cwd(), output) : tmpNameSync()
	await Jet.writeAsync(name, mergedPDF)
	return name
}
