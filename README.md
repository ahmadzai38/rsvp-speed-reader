# RSVP Speed Reader

A clean, dark, modern speed‑reading web app. Paste text or upload a `.txt` /
`.pdf` file, then read it one word at a time using **Rapid Serial Visual
Presentation (RSVP)**. One letter in each word is highlighted red (the Optimal
Recognition Point) to help your brain lock onto the word instantly.

Everything runs **locally in your browser** — there is no backend.

## Features

- 📋 Paste text **or** upload `.txt` / `.pdf` (PDF parsed in‑browser with PDF.js)
- 🔴 One red "focus" letter per word, kept centered on screen
- ▶️ Play / Pause, Restart, Previous, Next
- 🎚️ WPM slider (100–1000, default 300) — speed changes apply instantly
- 📊 Progress bar with `current / total words` and percentage
- ⏱️ Estimated reading time at the current speed
- ⌨️ Keyboard shortcuts: `Space` play/pause · `←` prev · `→` next · `R` restart
- 🧪 "Load Sample Text" button to try it instantly
- 🖥️ Fullscreen reading mode
- 📱 Mobile‑friendly responsive layout

## Tech stack

React · Vite · JavaScript · Tailwind CSS · PDF.js

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

To build for production:

```bash
npm run build
npm run preview
```

## How the red letter is chosen

The highlighted letter index depends on word length:

| Word length | Highlighted index |
| ----------- | ----------------- |
| 1           | 0                 |
| 2–5         | 1                 |
| 6–9         | 2                 |
| 10+         | 3                 |

## Project structure

```
src/
  App.jsx                 # main state + screens + play loop + shortcuts
  main.jsx                # React entry point
  index.css               # Tailwind directives + base styles
  sampleText.js           # sample text for the demo button
  components/
    TextInput.jsx         # paste-text option
    FileUpload.jsx        # .txt / .pdf upload option
    Reader.jsx            # the centered word with the red letter
    Controls.jsx          # buttons + WPM slider + fullscreen
    ProgressBar.jsx       # progress bar + counts
  utils/
    textParser.js         # parseTextToWords()
    highlightLetter.js    # getHighlightIndex() + splitWordForHighlight()
    pdfParser.js          # extractTextFromPdf() using PDF.js
```
