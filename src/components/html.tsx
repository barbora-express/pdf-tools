import { PDF } from '../pdf'
import * as P from 'ts-prime'
import { flipDimensions } from '../utils'

export function getPageDimensions(format: PDF.Format, landscape: boolean) {
	const dimensions = {
		A3: [297, 420],
		A4: [210, 297],
		A5: [148, 210],
		A6: [105, 148],
	}

	if (P.isArray(format)) {
		return flipDimensions(format, landscape)
	}

	return flipDimensions(dimensions[format], landscape)
}

export function HtmlDoc(props: { pages: PDF.Content[] }) {
	return (
		<html>
			<head>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body>
				{props.pages.map(({ content, landscape, format }) => {
					const dimensions = getPageDimensions(format, !!landscape)
					return (
						<div
							style={{
								border: '1px solid #000',
								margin: 10,
								...dimensions,
							}}
							dangerouslySetInnerHTML={{
								__html: content,
							}}
						></div>
					)
				})}
			</body>
		</html>
	)
}
