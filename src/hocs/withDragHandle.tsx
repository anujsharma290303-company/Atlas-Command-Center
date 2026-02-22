import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveWidget } from "../features/widgetLayout/widgetLayoutSlice";
import type { RootState } from "../store/store";

export interface DragHandleProps {
  isDragging: boolean;
  dragHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
    title: string;
  };
}

const withDragHandle =
  <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  (props: P & { widgetId?: string }) => {
    const dispatch = useDispatch();

    // ✅ get saved position from Redux on mount
    const widgetId = props.widgetId ?? WrappedComponent.displayName ?? WrappedComponent.name;
    const savedPosition = useSelector((state: RootState) =>
      state.widgetLayout.widgets.find((w) => w.id === widgetId)
    );

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
      x: savedPosition?.x ?? 0,
      y: savedPosition?.y ?? 0,
    });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      // ✅ save final position to Redux when drag ends
      dispatch(moveWidget({
        id: widgetId,
        x: position.x,
        y: position.y,
      }));
    };

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.15s ease",
          zIndex: isDragging ? 50 : "auto",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* drag handle bar */}
        <div
          onMouseDown={handleMouseDown}
          className={`flex items-center justify-between px-3 py-1.5 
            rounded-t-xl bg-white/5 border border-white/10 border-b-0
            ${isDragging ? "cursor-grabbing bg-white/10" : "cursor-grab"}`}
        >
          <span className="text-gray-500 text-xs">
            {isDragging ? "dragging..." : "drag to move"}
          </span>
          <span className="text-gray-500 text-lg tracking-widest">⠿</span>
        </div>

        <WrappedComponent {...(props as P)} />
      </div>
    );
  };

export default withDragHandle;