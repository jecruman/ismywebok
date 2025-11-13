export default function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-500' : 'bg-red-600';

  return (
    <div
      className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}
    >
      {score}
    </div>
  );
}
