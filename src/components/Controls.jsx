// All the playback controls: previous, play/pause, next, restart,
// the WPM slider, and a fullscreen toggle.

// Small reusable button so every control looks consistent.
function ControlButton({ onClick, children, label, primary = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold transition " +
        (primary
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-800 text-gray-200 hover:bg-gray-700")
      }
    >
      {children}
    </button>
  );
}

export default function Controls({
  isPlaying,
  onPlayPause,
  onRestart,
  onPrev,
  onNext,
  wpm,
  onWpmChange,
  onToggleFullscreen,
}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Row of round buttons */}
      <div className="flex items-center gap-4">
        <ControlButton onClick={onRestart} label="Restart (R)">
          ⟲
        </ControlButton>
        <ControlButton onClick={onPrev} label="Previous word (Left arrow)">
          ◀
        </ControlButton>
        <ControlButton
          onClick={onPlayPause}
          label={isPlaying ? "Pause (Space)" : "Play (Space)"}
          primary
        >
          {isPlaying ? "❚❚" : "▶"}
        </ControlButton>
        <ControlButton onClick={onNext} label="Next word (Right arrow)">
          ▶
        </ControlButton>
        <ControlButton onClick={onToggleFullscreen} label="Toggle fullscreen">
          ⛶
        </ControlButton>
      </div>

      {/* WPM slider */}
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>Speed</span>
          <span className="font-semibold text-gray-200">{wpm} WPM</span>
        </div>
        <input
          type="range"
          min="100"
          max="1000"
          step="10"
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
          className="w-full cursor-pointer accent-red-500"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-600">
          <span>100</span>
          <span>1000</span>
        </div>
      </div>
    </div>
  );
}
