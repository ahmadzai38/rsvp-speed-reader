// Shows reading progress: a filled bar plus "X / Y words" and a percentage.
export default function ProgressBar({ current, total }) {
  // current is a 0-based index; show it as 1-based for humans.
  const wordNumber = total === 0 ? 0 : current + 1;
  const percent = total === 0 ? 0 : Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      {/* The track + fill */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Numbers under the bar */}
      <div className="mt-2 flex justify-between text-sm text-gray-400">
        <span>
          {wordNumber} / {total} words
        </span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}
