
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
import { PDF } from '@barbora-express/pdf'

async function generatePDF() {
    const file = await PDF.generate([{ content: "this is my pdf" }])
}
generatePDF()

```
