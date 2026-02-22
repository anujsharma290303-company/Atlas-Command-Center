import { useState } from "react";
import DataTable from "../components/generic/DataTable";
import type{ ColumnDef } from "../components/generic/DataTable";
import CountryDetail from "../components/explorer/CountryDetail";
import { useSearchCountryQuery } from "../api/countryApi";

/* ✅ Strong typing */
export interface Country extends Record<string, unknown> {
  name: { common: string };
  region: string;
  population: number;
}

const DataExplorer = () => {
  const [search, setSearch] = useState("india");
  const [selected, setSelected] = useState<Country | null>(null);

  const { data = [] } = useSearchCountryQuery(search);

  
  const columns: ColumnDef<Country>[] = [
    {
      header: "Country",
      accessor: "name",
      render: (_, row) => row.name.common,
    },
    {
      header: "Region",
      accessor: "region",
    },
    {
      header: "Population",
      accessor: "population",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        Data Explorer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 h-full">
        {/* LEFT PANEL */}
        <div className="widget-card p-4 overflow-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full mb-4 px-3 py-2 rounded-lg"
          />

          <DataTable<Country>
            data={data}
            columns={columns}
            onRowClick={setSelected}
            sortable
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="widget-card p-4">
          {selected ? (
            <CountryDetail country={selected} />
          ) : (
            <p>Select a country</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
