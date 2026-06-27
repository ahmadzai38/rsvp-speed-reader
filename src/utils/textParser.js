// Turns a big string of text into an array of individual words.
//
// Rules:
//  - Collapse all runs of whitespace (spaces, newlines, tabs) into one space.
//  - Trim leading/trailing whitespace.
//  - Split on spaces.
//  - Drop any empty strings.
//  - Punctuation stays attached to its word (e.g. "test." stays "test.").
export function parseTextToWords(text) {
  if (!text) return [];

  return text
    .replace(/\s+/g, " ") // collapse whitespace
    .trim() // remove edges
    .split(" ") // split into words
    .filter(Boolean); // ignore empty strings
}
