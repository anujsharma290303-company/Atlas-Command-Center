import React, { useState } from "react";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  sortable?: boolean;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  sortable = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [ascending, setAscending] = useState(true);

  const sortedData = React.useMemo(() => {
    if (!sortable || !sortKey) return data; // ✅ fixed

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == bVal) return 0;
      if (aVal! > bVal!) return ascending ? 1 : -1;
      return ascending ? -1 : 1;
    });
  }, [data, sortKey, ascending, sortable]);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    if (sortKey === key) {
      setAscending((prev) => !prev); // toggle direction
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-white">
        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                onClick={() => handleSort(col.accessor)}
                className={`px-4 py-3 text-left ${
                  sortable ? "cursor-pointer hover:text-white" : ""
                }`}
              >
                {col.header}
                {sortable && sortKey === col.accessor && (
                  <span className="ml-1">{ascending ? "↑" : "↓"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`border-t border-white/5 transition ${
                onRowClick ? "cursor-pointer hover:bg-white/5" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-4 py-3">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;