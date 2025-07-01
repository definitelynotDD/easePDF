const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const mergeBtn = document.getElementById('merge-btn');
const statusText = document.getElementById('status');

let selectedFiles = [];

document.getElementById('select-btn').onclick = () => fileInput.click();

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.style.borderColor = '#e5322d';
});
dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#ccc';
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#ccc';
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  selectedFiles = [...files].filter(f => f.type === 'application/pdf');
  if (selectedFiles.length > 1) {
    mergeBtn.disabled = false;
    mergeBtn.classList.add('enabled');
    statusText.textContent = `${selectedFiles.length} PDFs selected.`;
  } else {
    mergeBtn.disabled = true;
    mergeBtn.classList.remove('enabled');
    statusText.textContent = `Please select at least 2 PDFs.`;
  }
}

mergeBtn.addEventListener('click', async () => {
  if (selectedFiles.length < 2) return;

  statusText.textContent = 'Merging PDFs...';

  try {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of selectedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();
    download(mergedBytes, 'merged.pdf', 'application/pdf');
    statusText.textContent = 'PDF merged successfully!';
  } catch (err) {
    console.error(err);
    statusText.textContent = 'Failed to merge PDFs.';
  }
});
