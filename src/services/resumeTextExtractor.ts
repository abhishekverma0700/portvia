async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');

  if (pdfjs.GlobalWorkerOptions?.workerSrc !== pdfWorker.default) {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker.default;
  }

  const fileBuffer = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: new Uint8Array(fileBuffer), useWorkerFetch: false });
  const pdf = await task.promise;

  const pageTexts: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    // Reconstruct visual lines by grouping text items sharing the same Y coordinate.
    // PDF coordinate system has Y increasing upward, so higher Y = higher on the page.
    type TextChunk = { str: string; x: number };
    const lineMap = new Map<number, TextChunk[]>();

    for (const item of textContent.items as any[]) {
      const str: string = typeof item?.str === 'string' ? item.str : '';
      if (!str.trim()) continue;
      const rawY: number = item.transform?.[5] ?? 0;
      const x: number = item.transform?.[4] ?? 0;

      // Snap Y to nearest integer so items on the same visual line group together
      // even when sub-pixel differences exist between text fragments.
      const snapY = Math.round(rawY);

      // If an existing key is within 2 units, merge into that bucket.
      let lineKey = snapY;
      for (const existingKey of lineMap.keys()) {
        if (Math.abs(existingKey - snapY) <= 2) {
          lineKey = existingKey;
          break;
        }
      }

      if (!lineMap.has(lineKey)) lineMap.set(lineKey, []);
      lineMap.get(lineKey)!.push({ str, x });
    }

    if (!lineMap.size) continue;

    // Sort buckets by descending Y (top of page first) and within each line by
    // ascending X (left to right).
    const sortedLineText = Array.from(lineMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, chunks]) =>
        chunks
          .sort((a, b) => a.x - b.x)
          .map(c => c.str)
          .join(' ')
          .trim(),
      )
      .filter(Boolean);

    if (sortedLineText.length) pageTexts.push(sortedLineText.join('\n'));
  }

  return pageTexts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
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
