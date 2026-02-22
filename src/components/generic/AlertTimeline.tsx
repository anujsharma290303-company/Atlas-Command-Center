import type { AlertEvent } from "../../types/alerts";

interface AlertTimelineProps {
  history: AlertEvent[]; // ✅ was: any
}

const AlertTimeline = ({ history }: AlertTimelineProps) => {
  // ✅ empty state — was silently rendering nothing
  if (history.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No alerts triggered yet.
      </p>
    );
  }

  return (
    <div className="timeline space-y-3">
      {history.map((event) => ( // ✅ event is now typed — no more any
        <div key={event.id} className="timeline-item flex items-start gap-3">
          <div className="dot w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-sm text-white">{event.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertTimeline;