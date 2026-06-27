import { useState } from "react";
import { extractTextFromPdf } from "../utils/pdfParser.js";

// Option 2: let the user upload a .txt or .pdf file.
export default function FileUpload({ onStart, onError }) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    // Reset the input so picking the same file again still triggers onChange.
    event.target.value = "";
    if (!file) return;

    setFileName(file.name);
    onError("");

    const lowerName = file.name.toLowerCase();
    const isTxt = lowerName.endsWith(".txt") || file.type === "text/plain";
    const isPdf = lowerName.endsWith(".pdf") || file.type === "application/pdf";

    if (!isTxt && !isPdf) {
      onError("Only .txt and .pdf files are supported.");
      setFileName("");
      return;
    }

    try {
      setLoading(true);
      let text = "";

      if (isTxt) {
        text = await file.text();
      } else {
        // PDF path.
        try {
          text = await extractTextFromPdf(file);
        } catch (err) {
          console.error(err);
          onError("Could not read this PDF. Please try another file.");
          return;
        }
      }

      // Hand the raw text up to App, which validates + parses it.
      onStart(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">
        Or upload a file (.txt or .pdf)
      </label>

      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-600 bg-gray-900 px-4 py-8 text-center text-gray-400 transition hover:border-red-500 hover:text-gray-200">
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFile}
          className="hidden"
        />
        {loading ? (
          <span>Reading file…</span>
        ) : (
          <span>
            Click to choose a <strong>.txt</strong> or <strong>.pdf</strong> file
            {fileName ? ` — selected: ${fileName}` : ""}
          </span>
        )}
      </label>
    </div>
  );
}
