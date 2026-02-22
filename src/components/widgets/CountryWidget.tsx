import { useState } from "react";
import { useSearchCountryQuery } from "../../api/countryApi";
import { mapApiState } from "../../utils/apistate";
import CardGrid from "../generic/CardGrid";
import DataTable from "../generic/DataTable";
import type { ColumnDef } from "../generic/DataTable";
import type { CountryResponse, CountryFlags, CountryName } from "../../types/country"; 
type View = "card" | "table";

const CountryWidget = () => {
  const [search, setSearch] = useState("India");
  const [view, setView] = useState<View>("card");

  const countryQuery = useSearchCountryQuery(search, {
    skip: search.length < 2,
  });

  const state = mapApiState(countryQuery);

  if (state.status === "loading") return <div className="p-4">Loading Country...</div>;
  if (state.status === "error")   return <div className="p-4">Country Not Found</div>;
  if (state.status !== "success") return <div className="p-4">Country Not Found</div>;

  const countries = state.data;

  if (!countries.length) return <div className="p-4">Country Not Found</div>;

  const columns: ColumnDef<CountryResponse>[] = [
    {
      header: "Flag",
      accessor: "flags",
      render: (v: unknown) => {
        const flags = v as CountryFlags;
        return <img src={flags.png} alt="flag" className="w-8 h-5 object-cover rounded" />;
      },
    },
    {
      header: "Name",
      accessor: "name",
      render: (v: unknown) => {
        const name = v as CountryName;
        return <span>{name.common}</span>;
      },
    },
    {
      header: "Region",
      accessor: "region",
    },
    {
      header: "Population",
      accessor: "population",
      render: (v: unknown) => Number(v).toLocaleString(),
    },
    {
      header: "Capital",
      accessor: "capital",
      render: (v: unknown) => {
        const capital = v as string[] | undefined;
        return capital?.[0] ?? "N/A";
      },
    },
  ];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 md:p-6 text-white shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Country Intelligence</h2>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("card")}
            className={`px-3 py-1 rounded-lg text-sm ${
              view === "card"
                ? "bg-sky-500 text-white"
                : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            Card
          </button>
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
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Country...."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 border border-amber/50 outline-none focus:border-sky-400"
      />

      {/* Card view */}
      {view === "card" && (
        <CardGrid<CountryResponse>
          items={countries}
          renderItem={(country) => {
            const currency = country.currencies
              ? Object.values(country.currencies)[0]
              : null;
            const languages = country.languages
              ? Object.values(country.languages).join(", ")
              : "N/A";

            return (
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition h-full">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={country.flags.png}
                    alt="flag"
                    className="w-10 h-7 object-cover rounded"
                  />
                  <h3 className="font-semibold">{country.name.common}</h3>
                </div>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>Region: {country.region}</p>
                  <p>Capital: {country.capital?.[0] ?? "N/A"}</p>
                  <p>Population: {country.population.toLocaleString()}</p>
                  <p>Languages: {languages}</p>
                  {currency && (
                    <p>Currency: {currency.name} ({currency.symbol})</p>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}

      {/* Table view */}
      {view === "table" && (
        <DataTable<CountryResponse>
          data={countries}
          columns={columns}
          sortable
        />
      )}
    </div>
  );
};

export default CountryWidget;