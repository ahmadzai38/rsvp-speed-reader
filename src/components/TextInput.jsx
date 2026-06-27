import { useState } from "react";
import { SAMPLE_TEXT } from "../sampleText.js";

// Option 1: let the user paste text and start reading.
export default function TextInput({ onStart, onError }) {
  const [text, setText] = useState("");

  function handleStart() {
    // Validate: there must be some non-whitespace text.
    if (!text.trim()) {
      onError("Please paste some text first.");
      return;
    }
    onError(""); // clear any old error
    onStart(text);
  }

  function handleClear() {
    setText("");
    onError("");
  }

  function handleSample() {
    setText(SAMPLE_TEXT);
    onError("");
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">Paste your text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste any text here and press Start Reading…"
        rows={8}
        className="w-full resize-y rounded-xl border border-gray-700 bg-gray-900 p-4 text-gray-100 placeholder-gray-500 outline-none focus:border-red-500"
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleStart}
          className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          Start Reading
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg bg-gray-800 px-5 py-2 font-semibold text-gray-200 transition hover:bg-gray-700"
        >
          Clear
        </button>
        <button
          onClick={handleSample}
          className="rounded-lg bg-gray-800 px-5 py-2 font-semibold text-gray-200 transition hover:bg-gray-700"
        >
          Load Sample Text
        </button>
      </div>
    </div>
  );
}
