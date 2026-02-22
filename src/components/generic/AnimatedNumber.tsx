import { useEffect, useRef, useReducer } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

interface State {
  display: number;
  direction: "up" | "down" | null;
}

type Action =
  | { type: "TICK"; value: number }
  | { type: "DONE"; value: number; direction: "up" | "down" }
  | { type: "CLEAR_DIRECTION" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK":
      return { ...state, display: action.value };
    case "DONE":
      // ✅ direction + final value in one atomic update — no cascading renders
      return { display: action.value, direction: action.direction };
    case "CLEAR_DIRECTION":
      return { ...state, direction: null };
    default:
      return state;
  }
};

const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  duration = 600,
  className = "",
}: AnimatedNumberProps) => {
  const [state, dispatch] = useReducer(reducer, {
    display: value,
    direction: null,
  });

  const prevRef  = useRef(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;

    const direction = value > prev ? "up" : "down";
    const startVal  = prev;
    const delta     = value - prev;
    const start     = performance.now();

    prevRef.current = value;

    const tick = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic

      if (progress < 1) {
        // ✅ mid-animation ticks only update display — no direction change
        dispatch({ type: "TICK", value: startVal + delta * eased });
        frameRef.current = requestAnimationFrame(tick);
      } else {
        // ✅ final update sets both display and direction atomically
        dispatch({ type: "DONE", value, direction });
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    // Clear direction glow after 1.2s
    const timeout = setTimeout(
      () => dispatch({ type: "CLEAR_DIRECTION" }),
      1200
    );

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeout);
    };
  }, [value, duration]);

  const color =
    state.direction === "up"   ? "var(--success)" :
    state.direction === "down" ? "var(--danger)"  :
    "var(--text-primary)";

  return (
    <span
      className={`font-mono tabular-nums transition-colors duration-300 ${className}`}
      style={{
        color,
        textShadow: state.direction
          ? `0 0 8px ${state.direction === "up" ? "var(--success)" : "var(--danger)"}`
          : "none",
      }}
    >
      {prefix}
      {state.display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;