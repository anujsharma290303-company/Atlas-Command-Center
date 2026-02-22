import type { WidgetLayout } from "../../features/widgetLayout/widgetLayoutSlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { ReactNode } from "react";

interface DashboardGridProps {
  children: (widgets: WidgetLayout[]) => ReactNode;
}

const DashboardGrid = ({ children }: DashboardGridProps) => {
  const widgets = useAppSelector((state) => state.widgetLayout.widgets);

  return (
    <div className="dashboard-grid grid gap-4 p-4">{children(widgets)}</div>
  );
};

export default DashboardGrid;
