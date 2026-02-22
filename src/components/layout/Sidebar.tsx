import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Alerts",    path: "/alerts",    icon: "🔔" },
    { name: "Settings",  path: "/settings",  icon: "⚙️" }, // ✅ added
  ];

  const renderNavItems = () =>
    navItems.map((item) => {
      const active = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? "bg-sky-500/20 text-sky-400"
                : "hover:bg-white/10 text-gray-300"
            }
          `}
        >
          <span className="text-lg">{item.icon}</span>
          {(!collapsed || mobileOpen) && <span>{item.name}</span>}
        </Link>
      );
    });

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full bg-slate-900 
          border-r border-white/10 transition-all duration-300
          ${collapsed ? "md:w-16" : "md:w-64"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 w-64"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          {(!collapsed || mobileOpen) && (
            <span className="font-semibold text-lg">Atlas CC</span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden md:block text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-2">{renderNavItems()}</nav>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 right-5 md:hidden bg-sky-500 text-white p-4 rounded-full shadow-lg z-30 hover:bg-sky-600 transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;