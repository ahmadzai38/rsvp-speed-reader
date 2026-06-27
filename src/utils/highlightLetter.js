// Decides which letter of a word should be highlighted red.
//
// This is the "Optimal Recognition Point" (ORP) — the spot your eye should
// land on so it can recognize the whole word fastest.
//
// Rule (based on word length):
//   length 1        -> index 0
//   length 2 to 5   -> index 1
//   length 6 to 9   -> index 2
//   length 10+      -> index 3
export function getHighlightIndex(word) {
  const cleanLength = word.length;

  if (cleanLength <= 1) return 0;
  if (cleanLength <= 5) return 1;
  if (cleanLength <= 9) return 2;
  return 3;
}

// Helper that splits a word into 3 parts around the highlighted letter:
//   { before, highlight, after }
// Example: "reading" -> { before: "re", highlight: "a", after: "ding" }
export function splitWordForHighlight(word) {
  const index = getHighlightIndex(word);
  return {
    before: word.slice(0, index),
    highlight: word.charAt(index),
    after: word.slice(index + 1),
  };
}
