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
    // refine pagesText so that each word converted to lowercase and without . (dot) also , ( comma)
    const refinedText = pagesText.map(pageText =>
      pageText.toLowerCase().replace(/[.,]/g, '')
    );

    const words = refinedText.join(' ').split(' ');

    const skillsToMatch = localStorage.getItem('skills').split(',');

    // now match the skills with the words
    const matchedSkills = skillsToMatch.filter(skill => words.includes(skill));
    console.log('Matched Skills:', matchedSkills);
    alert(matchedSkills);

    return pagesText;
  }
}

export default new PdfService();
