import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { toggleTheme } from "../features/settings/settingsSlice";
import {
  resetLayoutToDefault,
  setRefreshInterval,
  toggleWidgetVisibility,
} from "../features/widgetLayout/widgetLayoutSlice";
import { useGetUsersQuery } from "../api/authApi"; // ✅ was: userApi — now from authApi

const INTERVAL_OPTIONS = [
  { label: "15s", value: 15000  },
  { label: "30s", value: 30000  },
  { label: "1m",  value: 60000  },
  { label: "5m",  value: 300000 },
  { label: "10m", value: 600000 },
];

const Settings = () => {
  const dispatch  = useAppDispatch();
  const theme     = useAppSelector((s) => s.settings.theme);
  const widgets   = useAppSelector((s) => s.widgetLayout.widgets);
  const intervals = useAppSelector((s) => s.widgetLayout.refreshIntervals);

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Settings
      </h1>

      {/* ── Theme ─────────────────────────────────────────── */}
      <section className="widget-card space-y-4">
        <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          Appearance
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Theme
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Currently: {theme === "dark" ? "Command-center dark" : "Light"}
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="relative w-14 h-7 rounded-full transition-colors duration-300"
            style={{
              background: theme === "dark" ? "var(--accent)" : "var(--bg-elevated)",
              boxShadow: theme === "dark" ? "0 0 8px var(--accent-glow)" : "none",
            }}
          >
            <span
              className="absolute top-1 w-5 h-5 rounded-full transition-transform duration-300"
              style={{
                background: "var(--text-inverse)",
                left: theme === "dark" ? "calc(100% - 1.5rem)" : "0.25rem",
              }}
            />
          </button>
        </div>
      </section>

      {/* ── Widget Layout ──────────────────────────────────── */}
      <section className="widget-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
            Widget Layout
          </h2>
          <button
            onClick={() => dispatch(resetLayoutToDefault())}
            className="px-3 py-1.5 text-xs rounded-lg transition"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
          >
            Reset to Default
          </button>
        </div>

        <div className="space-y-2">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(toggleWidgetVisibility(widget.id))}
                  className="w-4 h-4 rounded border flex items-center justify-center text-xs transition"
                  style={{
                    background:  widget.visible ? "var(--accent)"      : "transparent",
                    borderColor: widget.visible ? "var(--accent)"      : "var(--text-muted)",
                    boxShadow:   widget.visible ? "0 0 6px var(--accent-glow)" : "none",
                  }}
                >
                  {widget.visible && (
                    <span style={{ color: "var(--text-inverse)" }}>✓</span>
                  )}
                </button>
                <span className="text-sm capitalize" style={{ color: "var(--text-primary)" }}>
                  {widget.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Refresh
                </span>
                <select
                  value={intervals[widget.id] ?? 60000}
                  onChange={(e) =>
                    dispatch(setRefreshInterval({
                      id: widget.id,
                      interval: Number(e.target.value),
                    }))
                  }
                  className="text-xs px-2 py-1 rounded-lg border"
                  style={{
                    background:  "var(--bg-elevated)",
                    color:       "var(--text-primary)",
                    borderColor: "var(--border)",
                  }}
                >
                  {INTERVAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Profile ───────────────────────────────────────── */}
      <section className="widget-card space-y-4">
        <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          Profile
        </h2>

        {usersLoading ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading users...
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>
                Select mock user
              </label>
              <select
                value={selectedUserId ?? ""}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 rounded-lg border"
                style={{
                  background:  "var(--bg-elevated)",
                  color:       "var(--text-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <option value="">— choose a user —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}  {/* ✅ dummyjson uses firstName/lastName not name */}
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <div
                className="rounded-lg p-4 space-y-2 text-sm"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* ✅ dummyjson provides an actual avatar image */}
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.username}
                    className="w-10 h-10 rounded-full object-cover glow"
                    style={{ border: "1px solid var(--accent)" }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>

                {[
                  { label: "Email",   value: selectedUser.email },
                  { label: "Phone",   value: selectedUser.phone },
                  { label: "Company", value: selectedUser.company?.name },
                  { label: "City",    value: selectedUser.address?.city },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ color: "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;