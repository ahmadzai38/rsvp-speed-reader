import { useEffect, useRef, useState, useCallback } from "react";
import TextInput from "./components/TextInput.jsx";
import FileUpload from "./components/FileUpload.jsx";
import Reader from "./components/Reader.jsx";
import Controls from "./components/Controls.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import { parseTextToWords } from "./utils/textParser.js";

export default function App() {
  // ----- App state -----
  const [words, setWords] = useState([]); // array of word strings
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(300); // words per minute
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState("input"); // "input" | "reader"

  const readerContainerRef = useRef(null); // used for fullscreen

  // ----- Loading new content -----
  // Called by both TextInput and FileUpload with the raw text string.
  function handleLoadText(rawText) {
    const parsed = parseTextToWords(rawText);

    if (parsed.length === 0) {
      setError("No readable text was found.");
      return;
    }

    // Reset everything for the new content.
    setWords(parsed);
    setCurrentWordIndex(0);
    setIsPlaying(false);
    setError("");
    setScreen("reader");
  }

  // ----- Playback controls -----
  const handlePlayPause = useCallback(() => {
    // If we're at the very end, pressing play restarts from the beginning.
    setIsPlaying((playing) => {
      if (!playing && currentWordIndex >= words.length - 1) {
        setCurrentWordIndex(0);
      }
      return !playing;
    });
  }, [currentWordIndex, words.length]);

  const handleRestart = useCallback(() => {
    setCurrentWordIndex(0);
  }, []);

  const handlePrev = useCallback(() => {
    setIsPlaying(false);
    setCurrentWordIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentWordIndex((i) => Math.min(words.length - 1, i + 1));
  }, [words.length]);

  // ----- The play loop -----
  // Whenever we're playing, schedule advancing to the next word after the
  // delay implied by the current WPM. Because this effect depends on `wpm`,
  // changing the slider while playing applies the new speed immediately.
  useEffect(() => {
    if (!isPlaying) return;

    // Stop automatically at the last word.
    if (currentWordIndex >= words.length - 1) {
      setIsPlaying(false);
      return;
    }

    const delay = 60000 / wpm; // ms per word
    const timer = setTimeout(() => {
      setCurrentWordIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, wpm, words.length]);

  // ----- Fullscreen -----
  const handleToggleFullscreen = useCallback(() => {
    const el = readerContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // ----- Keyboard shortcuts (only on the reader screen) -----
  useEffect(() => {
    if (screen !== "reader") return;

    function onKeyDown(e) {
      switch (e.key) {
        case " ":
          e.preventDefault(); // stop the page from scrolling
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "r":
        case "R":
          handleRestart();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, handlePlayPause, handlePrev, handleNext, handleRestart]);

  // ----- Estimated reading time at current WPM -----
  function formatReadingTime() {
    if (words.length === 0) return "0s";
    const totalSeconds = Math.round((words.length / wpm) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  // =====================================================================
  // Render
  // =====================================================================
  return (
    <div className="min-h-full bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            RSVP <span className="text-red-500">Speed</span> Reader
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Read faster with Rapid Serial Visual Presentation.
          </p>
        </header>

        {/* Error banner (shown on either screen) */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ---------------- INPUT SCREEN ---------------- */}
        {screen === "input" && (
          <main className="flex flex-1 flex-col gap-8">
            <TextInput onStart={handleLoadText} onError={setError} />

            <div className="flex items-center gap-4 text-gray-600">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="text-xs uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            <FileUpload onStart={handleLoadText} onError={setError} />
          </main>
        )}

        {/* ---------------- READER SCREEN ---------------- */}
        {screen === "reader" && (
          <main className="flex flex-1 flex-col">
            {/* Fullscreen target: the word + controls live inside here so
                fullscreen shows a clean reading view. */}
            <div
              ref={readerContainerRef}
              className="flex flex-1 flex-col justify-center gap-10 rounded-2xl bg-neutral-950 py-10"
            >
              {/* The big word with the red focus letter */}
              <div className="flex flex-col items-center gap-2">
                {/* A thin guide marker above the word helps the eye anchor. */}
                <div className="h-4 w-px bg-gray-700" />
                <Reader word={words[currentWordIndex] ?? ""} />
                <div className="h-4 w-px bg-gray-700" />
              </div>

              {/* Controls */}
              <Controls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onRestart={handleRestart}
                onPrev={handlePrev}
                onNext={handleNext}
                wpm={wpm}
                onWpmChange={setWpm}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>

            {/* Progress + meta (outside fullscreen view) */}
            <div className="mt-8 flex flex-col gap-4">
              <ProgressBar current={currentWordIndex} total={words.length} />

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
                <span>Estimated time: {formatReadingTime()}</span>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setScreen("input");
                  }}
                  className="rounded-lg bg-gray-800 px-4 py-2 font-medium text-gray-200 transition hover:bg-gray-700"
                >
                  ← New text
                </button>
              </div>

              <p className="text-center text-xs text-gray-600">
                Shortcuts: Space = play/pause · ← prev · → next · R restart
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
