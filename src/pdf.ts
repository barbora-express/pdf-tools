import * as P from 'ts-prime'
import * as Jet from 'fs-jetpack'
import { tmpNameSync } from 'tmp'
import { PDFDocument } from 'pdf-lib'
const html_to_pdf = require('html-pdf-node')

export namespace PDF {
	export type Format = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6'

	export interface Content {
		content: string
		format: Format
		landscape?: boolean
	}

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

		const buf = await mergedPdf.save()
		return buf
	}

	async function singlePdf(content: Content) {
		const result = await P.canFail(
			() =>
				html_to_pdf.generatePdf(
					{
						content: content.content,
					},
					{
						format: content.format,
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
	export async function generate(args: Content[]) {
		const sample = await Promise.all(args.map((c) => singlePdf(c)))
		const mergedPDF = await mergePDF(sample)
		const name = tmpNameSync()
		await Jet.writeAsync(name, mergedPDF)
		return name
	}
}
