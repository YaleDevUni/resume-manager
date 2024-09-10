class PdfService {
  // Function to extract text from a PDF file
  async extractTextFromPdf(file) {
    // dynamic import to avoid SSR issues
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Read the file as an Uint8Array
    const arrayBuffer = await file.buffer;
    const uint8Array = new Uint8Array(arrayBuffer);
    // Load the PDF document
    const pdfDocument = await getDocument({ data: uint8Array }).promise;

    const pagesText = [];

    // Loop through each page
    for (let i = 0; i < pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i + 1); // Pages are 1-based in pdfjs

      // Get the text content of the page
      const textContent = await page.getTextContent();

      // Extract and join the text items into a single string
      const pageText = textContent.items.map(item => item.str).join(' ');

      pagesText.push(pageText);
    }
    // refine pagesText so that each word converted to lowercase and without . (dot) also , ( comma)
    const refinedText = pagesText.map(pageText =>
      pageText.toLowerCase().replace(/[.,]/g, '')
    );
    return refinedText;
  }
}

module.exports = PdfService;
