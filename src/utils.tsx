export function flipDimensions(dimensions: number[], landscape: boolean) {
	const [x, y] = dimensions
	if (!landscape) {
		return {
			width: `${x}mm`,
			height: `${y}mm`,
		}
	}
	return {
		width: `${y}mm`,
		height: `${x}mm`,
	}
}
