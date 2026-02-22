import { useState, useEffect } from "react";
import { mapApiState } from "../../utils/apistate";
import DataTable from "../generic/DataTable";
import type { ColumnDef } from "../generic/DataTable";
import CardGrid from "../generic/CardGrid";
import ChartWrapper from "../generic/ChartWrapper";
import { useGetMarketCoinsQuery } from "../../api/cryptoApi";
import type { CryptoCoin } from "../../types/crypto";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { pushNotification } from "../../features/notification/notificationSlice";
import { addAlertEvent } from "../../features/Alerts/alertSlice";
import { checkAlert } from "../../utils/checkAlerts";
import Skeleton from "../generic/Skeleton";
import BarChart from "../generic/BarChart";           // ✅ added
import Sparkline from "../generic/SparkLine";         // ✅ added
import AnimatedNumber from "../generic/AnimatedNumber"; // ✅ added

type View = "table" | "grid";

const CryptoWidget = () => {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<View>("table");

  const query = useGetMarketCoinsQuery();
  const state = mapApiState(query);

  useEffect(() => {
    if (state.status === "error") {
      dispatch(
        pushNotification({
          message: "Failed to load crypto market data",
          type: "error",
        }),
      );
    }

    if (state.status === "success") {
      dispatch(
        pushNotification({
          message: "Crypto market updated",
          type: "success",
        }),
      );
    }
  }, [state.status, dispatch]);

  const alertConfigs = useAppSelector((state) => state.alerts.configs);

  useEffect(() => {
    if (state.status !== "success") return;

    const coins = state.data;
    const cryptoAlerts = alertConfigs.filter((a) => a.type === "crypto");

    coins.forEach((coin: CryptoCoin) => {
      cryptoAlerts.forEach((alert) => {
        if (coin.symbol.toLowerCase() !== alert.target.toLowerCase()) return;

        const price = Number(coin.price_usd);
        const triggered = checkAlert(alert, price);

        if (triggered) {
          const message = `${coin.symbol} is ${alert.condition} threshold — $${price.toFixed(2)} ${
            alert.condition === "above" ? ">" : "<"
          } $${alert.threshold}`;

          dispatch(pushNotification({ message, type: "warning" }));

          dispatch(
            addAlertEvent({
              id: `${alert.id}-${coin.symbol}-${Date.now()}`,
              alertConfigId: alert.id,
              message,
              timestamp: Date.now(),
            }),
          );
        }
      });
    });
  }, [state.status, state, alertConfigs, dispatch]);

  // ===========================
  // UI STATES
  // ===========================

  if (state.status === "loading")
    return (
      <div className="space-y-3 p-4 ">
        <Skeleton classname="h-6 w-40" />
        <Skeleton classname="h-32 w-full" />
        <Skeleton classname="h-32 w-full" />
      </div>
    );

  if (state.status === "error") return <div className="p-4">{state.error}</div>;

  if (state.status !== "success") return null;

  const coins = state.data.slice(0, 10);

  const handleClick = (coin: CryptoCoin) => {
    dispatch(
      pushNotification({
        message: `${coin.name} selected`,
        type: "info",
      }),
    );
  };

  const columns: ColumnDef<CryptoCoin>[] = [
    { header: "Rank", accessor: "rank" },
    { header: "Name", accessor: "name" },
    { header: "Symbol", accessor: "symbol" },
    {
      header: "Price",
      accessor: "price_usd",
      // ✅ AnimatedNumber — ticks and glows on every data refresh
      render: (v: unknown) => (
        <AnimatedNumber value={Number(v)} prefix="$" decimals={2} />
      ),
    },
    {
      header: "24h %",
      accessor: "percent_change_24h",
      render: (v: unknown) => {
        const val = Number(v);
        return (
          <span className={val >= 0 ? "text-green-400" : "text-red-400"}>
            {val >= 0 ? "+" : ""}
            {val.toFixed(2)}%
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("table")}
          className={`px-3 py-1 rounded-lg text-sm ${
            view === "table"
              ? "bg-sky-500 text-white"
              : "bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setView("grid")}
          className={`px-3 py-1 rounded-lg text-sm ${
            view === "grid"
              ? "bg-sky-500 text-white"
              : "bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          Grid
        </button>
      </div>

      {/* Table */}
      {view === "table" && (
        <DataTable<CryptoCoin>
          data={coins}
          columns={columns}
          sortable
          onRowClick={handleClick}
        />
      )}

      {/* Grid */}
      {view === "grid" && (
        <CardGrid<CryptoCoin>
          items={coins}
          onItemClick={handleClick}
          renderItem={(coin) => {
            const val = Number(coin.percent_change_24h);
            return (
              <div className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">#{coin.rank}</span>
                  <span
                    className={`text-xs font-semibold ${
                      val >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {val >= 0 ? "+" : ""}
                    {val.toFixed(2)}%
                  </span>
                </div>
                <p className="font-semibold">{coin.name}</p>
                <p className="text-xs text-gray-400 uppercase mb-2">
                  {coin.symbol}
                </p>
                {/* ✅ AnimatedNumber in grid card */}
                <AnimatedNumber
                  value={Number(coin.price_usd)}
                  prefix="$"
                  decimals={2}
                  className="text-lg font-bold"
                />
                {/* ✅ Sparkline — 24h change as mini trend line */}
                <div className="mt-2">
                  <Sparkline
                    data={coins.map((c) => Number(c.percent_change_24h))}
                    width={120}
                    height={32}
                    strokeColor={val >= 0 ? "var(--success)" : "var(--danger)"}
                  />
                </div>
              </div>
            );
          }}
        />
      )}

      {/* Chart — replaced plain list with BarChart + Sparkline */}
      <ChartWrapper title="Market Snapshot" height={300}>
        <div className="space-y-4 h-full overflow-y-auto">

          {/* ✅ BarChart — top 5 by price */}
          <BarChart
            data={coins.slice(0, 5).map((c) => ({
              label: c.symbol,
              value: Number(c.price_usd),
            }))}
            height={100}
          />

          {/* ✅ Sparkline — 24h % change trend across top 10 */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              24h trend
            </span>
            <Sparkline
              data={coins.map((c) => Number(c.percent_change_24h))}
              width={200}
              height={40}
              strokeColor="var(--accent)"
            />
          </div>

          {/* Original coin list preserved */}
          {coins.map((coin) => (
            <div
              key={coin.id}
              onClick={() => handleClick(coin)}
              className="flex justify-between text-sm px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
            >
              <span>{coin.name}</span>
              {/* ✅ AnimatedNumber in list */}
              <AnimatedNumber
                value={Number(coin.price_usd)}
                prefix="$"
                decimals={2}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </ChartWrapper>
    </div>
  );
};

export default CryptoWidget;

CryptoWidget.displayName = "CryptoWidget";