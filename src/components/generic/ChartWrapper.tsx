import React from "react";
 
export interface ChartWrapperProps {
  title?: string;
  children: React.ReactNode;
  height?: number;
}
 
const ChartWrapper = ({
  title,
  children,
  height = 300,
}: ChartWrapperProps) => {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 shadow-md text-white">
      {title && (
        <h3 className="text-lg font-semibold mb-3">
          {title}
        </h3>
      )}
 
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
};
 
export default ChartWrapper;