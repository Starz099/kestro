import type { ResultSeriesPoint } from "@/types/results";

const buildPolyline = (points: Array<{ x: number; y: number }>) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");

type ResultsChartProps = {
  series: ResultSeriesPoint[];
};

const ResultsChart = ({ series }: ResultsChartProps) => {
  const width = 720;
  const height = 260;
  const padding = 24;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const maxValue = Math.max(
    1,
    ...series.map((point) => Math.max(point.wpm, point.rawWpm)),
  );
  const step = series.length > 1 ? plotWidth / (series.length - 1) : 0;

  const mapPoints = (key: "wpm" | "rawWpm") =>
    series.map((point, index) => {
      const x = padding + index * step;
      const y = padding + plotHeight - (point[key] / maxValue) * plotHeight;
      return { x, y };
    });

  const wpmPoints = mapPoints("wpm");
  const rawPoints = mapPoints("rawWpm");

  const errorPoints = series
    .map((point, index) => {
      const previousErrors = index > 0 ? series[index - 1].errors : 0;
      if (point.errors <= previousErrors) {
        return null;
      }

      const x = padding + index * step;
      const y = padding + 10;
      return { x, y };
    })
    .filter((point): point is { x: number; y: number } => point !== null);

  const horizontalLines = 4;
  const gridLines = Array.from({ length: horizontalLines }, (_, index) => {
    const y = padding + (plotHeight / (horizontalLines - 1)) * index;
    return y;
  });

  return (
    <div className="bg-card ring-foreground/10 w-full rounded-none p-4 ring-1">
      <div className="text-muted-foreground mb-3 flex items-center gap-4 text-xs uppercase">
        <span className="flex items-center gap-2">
          <span className="bg-foreground h-2 w-2 rounded-full" />
          WPM
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-muted-foreground h-2 w-2 rounded-full" />
          Raw
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-destructive h-2 w-2 rounded-full" />
          Errors
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full"
        role="img"
        aria-label="Typing results chart"
      >
        <rect
          x={padding}
          y={padding}
          width={plotWidth}
          height={plotHeight}
          className="stroke-border fill-transparent"
        />
        {gridLines.map((y, index) => (
          <line
            key={`grid-${index}`}
            x1={padding}
            y1={y}
            x2={padding + plotWidth}
            y2={y}
            className="stroke-border/70"
            strokeDasharray="4 6"
          />
        ))}
        {series.length === 0 ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            className="fill-muted-foreground text-sm"
          >
            No data yet
          </text>
        ) : (
          <>
            <polyline
              points={buildPolyline(rawPoints)}
              className="stroke-muted-foreground fill-none"
              strokeWidth={2}
            />
            <polyline
              points={buildPolyline(wpmPoints)}
              className="stroke-foreground fill-none"
              strokeWidth={2.5}
            />
            {errorPoints.map((point, index) => (
              <g key={`error-${index}`}>
                <line
                  x1={point.x - 4}
                  y1={point.y - 4}
                  x2={point.x + 4}
                  y2={point.y + 4}
                  className="stroke-destructive"
                  strokeWidth={2}
                />
                <line
                  x1={point.x + 4}
                  y1={point.y - 4}
                  x2={point.x - 4}
                  y2={point.y + 4}
                  className="stroke-destructive"
                  strokeWidth={2}
                />
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
};

export default ResultsChart;
