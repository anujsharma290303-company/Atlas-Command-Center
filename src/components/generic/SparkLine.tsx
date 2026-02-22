import { useMemo,useId } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  showDot?: boolean;       // highlight last point
  animated?: boolean;
}

const Sparkline = ({
  data,
  width = 120,
  height = 40,
  strokeColor = "var(--accent)",
  fillColor,
  showDot = true,
  animated = true,
}: SparklineProps) => {
  const { path, fillPath, lastPoint } = useMemo(() => {
    if (data.length < 2) return { path: "", fillPath: "", lastPoint: null };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pad = 2;
    const points = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (width - pad * 2),
      y: pad + ((1 - (v - min) / range) * (height - pad * 2)),
    }));

    // Smooth curve using cubic bezier
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const fillPath =
      `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return {
      path,
      fillPath,
      lastPoint: points[points.length - 1],
    };
  }, [data, width, height]);

const id = useId();
const gradientId = `spark-fill-${id}`;
const maskId = `spark-mask-${id}`;

  if (!path) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
    >
      <defs>
        {/* Fill gradient */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0"   />
        </linearGradient>

        {/* ✅ CSS-only draw animation via stroke-dashoffset */}
        {animated && (
          <mask id={maskId}>
            <rect
              x="0" y="0"
              width={width} height={height}
              fill="white"
              style={{
                animation: "sparkReveal 0.8s ease forwards",
                transformOrigin: "left",
              }}
            />
          </mask>
        )}
      </defs>

      {/* Fill area */}
      <path
        d={fillPath}
        fill={fillColor ?? `url(#${gradientId})`}
        mask={animated ? `url(#${maskId})` : undefined}
      />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        mask={animated ? `url(#${maskId})` : undefined}
        style={{
          filter: `drop-shadow(0 0 3px ${strokeColor})`,
        }}
      />

      {/* Last point dot */}
      {showDot && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={3}
          fill={strokeColor}
          style={{
            filter: `drop-shadow(0 0 4px ${strokeColor})`,
            animation: animated ? "dotPop 0.3s 0.8s ease both" : "none",
          }}
        />
      )}

      <style>{`
        @keyframes sparkReveal {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes dotPop {
          from { r: 0; opacity: 0; }
          to   { r: 3; opacity: 1; }
        }
      `}</style>
    </svg>
  );
};

export default Sparkline;