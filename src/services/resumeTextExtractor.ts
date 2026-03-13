async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');

  if (pdfjs.GlobalWorkerOptions?.workerSrc !== pdfWorker.default) {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker.default;
  }

  const fileBuffer = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: new Uint8Array(fileBuffer), useWorkerFetch: false });
  const pdf = await task.promise;

  const pageText: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const chunks = textContent.items
      .map((item: any) => (typeof item?.str === 'string' ? item.str : ''))
      .filter(Boolean);
    pageText.push(chunks.join(' '));
  }

  return pageText.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const fileBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
  return (result.value || '').replace(/\n{3,}/g, '\n\n').trim();
}

export async function extractTextFromResumeFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    const text = await extractPdfText(file);
    if (!text) {
      throw new Error('Could not extract readable text from PDF.');
    }
    return text;
  }

  if (ext === 'docx') {
    const text = await extractDocxText(file);
    if (!text) {
      throw new Error('Could not extract readable text from DOCX.');
    }
    return text;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
}
