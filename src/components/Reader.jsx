import { splitWordForHighlight } from "../utils/highlightLetter.js";

// Displays a single word with one red "focus" letter kept in the
// horizontal center of the screen.
//
// Centering trick: we lay out three pieces in a row —
//   [ before ][ highlight ][ after ]
// The "before" half is right-aligned and the "after" half is left-aligned,
// each taking equal width. That keeps the red letter pinned to the middle
// no matter how long the rest of the word is.
export default function Reader({ word }) {
  const { before, highlight, after } = splitWordForHighlight(word ?? "");

  return (
    <div className="flex w-full select-none items-center justify-center">
      {/* A faint vertical guide line above/below could go here; we keep it
          simple with just the centered word. Monospace keeps letters aligned. */}
      <div className="flex items-baseline font-mono text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
        <span className="flex-1 text-right text-white">{before}</span>
        <span className="text-red-500">{highlight}</span>
        <span className="flex-1 text-left text-white">{after}</span>
      </div>
    </div>
  );
}
