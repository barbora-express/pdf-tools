
# PDF development and generation toolkit

This library helps with PDF generation tasks

## Installation

```bash
yarn add @barbora-express/pdf
```

## Make your first PDF

Developing PDF

```typescript
pdf.test.ts

export default [
    { content: "This is my pdf. Page 1", format: "A4" },
    { content: "This is my pdf. Page 2", format: "A4", landscape: true }
]
```

Watch PDF in browser environment

```bash
pdf --watch pdf.test.ts
```

```typescript
import { generate } from '@barbora-express/pdf'

async function generatePDF() {
    const file = await generate([{ content: "this is my pdf" }])
}
generatePDF()

```


## PDF development

This package ships with cli tool that helps pdf development


1. Create file sample.tsx

```ts
export default [{ content: "this is my pdf" }]
```

* Watch PDF generation with `yarn pdf-tools --watch sample.tsx`
* Build PDF with `yarn pdf-tools sample.tsx` define output `yarn pdf-tools --out ./sample.pdf sample.tsx`