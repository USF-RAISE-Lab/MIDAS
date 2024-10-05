import clsx from 'clsx';

function Square({ color }: { color: string }) {
  return (
    <div
      className={clsx('mx-1 h-3 w-3', {
        'bg-zinc-400': color === 'gray' || color === 'grey',
        'bg-red-500': color === 'red',
        'bg-amber-300': color === 'yellow',
        'bg-green-400': color === 'green',
      })}
    ></div>
  );
}

const colors = [
  ['red', 'gray', 'gray', 'gray', 'gray'],
  ['red', 'red', 'gray', 'gray', 'gray'],
  ['yellow', 'yellow', 'gray', 'gray', 'gray'],
  //['yellow', 'yellow', 'yellow', 'gray', 'gray'],
  ['green', 'green', 'green', 'green', 'gray'],
  ['green', 'green', 'green', 'green', 'green'],
];

interface ColorSelectionInterface {
  (arg0: number): string[];
}

export function ConfidenceIntervalVisualizer({
  confidence,
  thresholds,
  className
}: {
  confidence: number;
  thresholds: number[];
  className?: string;
}) {
  // confidence <= 80, 80 > confidence <= 90, 90 > confidence <= 95,
  const colorList: ColorSelectionInterface = (confidence) => {
    if (confidence <= thresholds[0]) {
      return colors[0];
    } else if (confidence > thresholds[0] && confidence <= thresholds[1]) {
      return colors[2];
    } else {
      return colors[4];
    }
  };

  return (
    <div className={`mx-2 flex flex-row ${className}`}>
      <Square color={colorList(confidence)[0]} />
      <Square color={colorList(confidence)[1]} />
      <Square color={colorList(confidence)[2]} />
    </div>
  );
}
