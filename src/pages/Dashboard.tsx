import React from "react";
import { useDispatch } from "react-redux";
import type { ComponentType } from "react";

import DashboardGrid from "../components/layout/DashboardGrid";
import { getGridSpan } from "../utils/gridSpan";

import WeatherWidget from "../components/widgets/WeatherWidget";
import NewsWidget from "../components/widgets/NewsWidget";
import CountryWidget from "../components/widgets/CountryWidget";
import CryptoWidget from "../components/widgets/CryptoWidget";
import PostsWidget from "../components/widgets/PostsWidget";
import WeatherMap from "../components/widgets/WeatherMap";

import withAuth from "../hocs/withAuth";
import withPermission from "../hocs/withPermission";
import withDataRefresh from "../hocs/withDataRefresh";
import withErrorBoundary from "../hocs/withErrorBoundary";
import withDragHandle from "../hocs/withDragHandle";

import { useGetMarketCoinsQuery } from "../api/cryptoApi";
import { useGetPostsQuery } from "../api/postApi";
import { logWidgetError } from "../features/widgetErrors/widgetErrorSlice";
import { compose } from "../utils/compose";
import type { AppDispatch } from "../store/store";

/* =====================================================
   Error Fallback
===================================================== */

const WidgetErrorFallback = ({
  error,
  retry,
}: {
  error: Error | null;
  retry: () => void;
}) => (
  <div className="bg-slate-900 border border-red-500/30 rounded-xl p-6 text-white shadow-md flex flex-col items-center justify-center min-h-32 gap-3">
    <p className="text-red-400 text-sm font-medium">⚠️ Widget Crashed</p>
    {error && (
      <p className="text-gray-500 text-xs text-center">{error.message}</p>
    )}
    <button
      onClick={retry}
      className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition"
    >
      Retry
    </button>
  </div>
);

/* =====================================================
   Simple Widget Factory (no Redux logging needed)
===================================================== */

const makeSimpleWidget = (Base: ComponentType) =>
  compose(
    (C: ComponentType) => withErrorBoundary(C),
    withAuth,
    withPermission("data:export"),
    withDragHandle
  )(Base);

/* =====================================================
   Data Widget Factory (Redux error logging + custom fallback)
===================================================== */

const makeDataWidget = (
  Base: ComponentType,
  permission: "data:export" | "users:manage",
  useQuery: Parameters<typeof withDataRefresh>[0],
  widgetName: string,
  dispatch: AppDispatch
) =>
  compose(
    (C: ComponentType) =>
      withErrorBoundary(C, {
        fallback: (error, retry) => (
          <WidgetErrorFallback error={error} retry={retry} />
        ),
        onError: (error, info) =>
          dispatch(
            logWidgetError({
              widget: widgetName,
              message: error.message,
              stack: info.componentStack,
            })
          ),
      }),
    withAuth,
    withPermission(permission),
    withDataRefresh(useQuery, 60000),
    withDragHandle
  )(Base);

/* =====================================================
   Static widgets — composed once at module level
   (no dispatch needed, stable references, never recreated)
===================================================== */

const ProtectedWeatherWidget  = makeSimpleWidget(WeatherWidget);
const ProtectedNewsWidget     = makeSimpleWidget(NewsWidget);
const ProtectedCountryWidget  = makeSimpleWidget(CountryWidget);
const ProtectedWeatherMap     = makeSimpleWidget(WeatherMap);

/* =====================================================
   Dashboard
===================================================== */

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Data widgets need dispatch so memoised inside component
  const ProtectedCryptoWidget = React.useMemo(
    () =>
      makeDataWidget(
        CryptoWidget,
        "data:export",
        useGetMarketCoinsQuery,
        "CryptoWidget",
        dispatch
      ),
    [dispatch]
  );

  const ProtectedPostsWidget = React.useMemo(
    () =>
      makeDataWidget(
        PostsWidget,
        "users:manage",
        useGetPostsQuery,
        "PostsWidget",
        dispatch
      ),
    [dispatch]
  );

  // ✅ Dynamic registry — add new widget here, Dashboard renders it automatically
  const widgetMap: Record<string, ComponentType> = React.useMemo(
    () => ({
      weather: ProtectedWeatherWidget,
      news:    ProtectedNewsWidget,
      country: ProtectedCountryWidget,
      map:     ProtectedWeatherMap,
      crypto:  ProtectedCryptoWidget,
      posts:   ProtectedPostsWidget,
    }),
    [ProtectedCryptoWidget, ProtectedPostsWidget]
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Title */}
      <h1 className="text-xl md:text-2xl font-semibold text-white">
        Dashboard
      </h1>

      {/* Grid controlled by Redux state */}
      <DashboardGrid>
        {(layout) =>
          layout
            .filter((widget) => widget.visible)
            .map((widget) => {
              const Widget = widgetMap[widget.id];

              // Unknown widget id in Redux state → skip gracefully
              if (!Widget) return null;

              return (
                <div
                  key={widget.id}
                  style={getGridSpan(widget.w, widget.h)}
                  className="min-h-0 transition-all duration-400 ease-in-out"
                >
                  <Widget />
                </div>
              );
            })
        }
      </DashboardGrid>
    </div>
  );
};

export default Dashboard;