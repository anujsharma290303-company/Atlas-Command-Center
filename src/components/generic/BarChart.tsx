import { useMemo } from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  showValues?: boolean;
  animated?: boolean;
}

const BarChart = ({
  data,
  height = 120,
  color = "var(--accent)",
  showValues = true,
  animated = true,
}: BarChartProps) => {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  return (
    <div className="w-full space-y-2">
      <div
        className="flex items-end gap-1.5 w-full"
        style={{ height }}
      >
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="flex flex-col items-center justify-end flex-1 gap-1 group"
            >
              {/* Value label on hover */}
              {showValues && (
                <span
                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono"
                  style={{ color: "var(--accent)" }}
                >
                  {d.value.toLocaleString()}
                </span>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-sm relative overflow-hidden"
                style={{
                  height: `${pct}%`,
                  background: color,
                  opacity: 0.75,
                  minHeight: 2,
                  boxShadow: `0 0 8px var(--accent-glow)`,
                  // ✅ CSS-only grow animation
                  animation: animated
                    ? `barGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms both`
                    : "none",
                  transformOrigin: "bottom",
                }}
              >
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1.5 w-full">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 text-center truncate"
            style={{ fontSize: 10, color: "var(--text-muted)" }}
          >
            {d.label}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BarChart;