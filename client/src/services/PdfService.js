import 'pdfjs-dist/build/pdf.worker.mjs';

class PdfService {
  // Function to extract text from a PDF file
  async extractTextFromPdf(file) {
    // dynamic import to avoid SSR issues
    const { getDocument } = await import('pdfjs-dist');

    // Read the file as an array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdfDocument = await getDocument({ data: arrayBuffer }).promise;

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

    return pagesText;
  }
}

export default new PdfService();

