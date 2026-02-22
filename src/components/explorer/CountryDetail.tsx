import { useState } from "react";
import type { Country } from "../../pages/DataExplorer";

interface Props {
  country: Country;
}

const CountryDetail = ({ country }: Props) => {
  const [tab, setTab] =
    useState<"overview" | "charts" | "related">(
      "overview"
    );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        {["overview", "charts", "related"].map((t) => (
          <button
            key={t}
            onClick={() =>
              setTab(t as "overview" | "charts" | "related")
            }
            className={tab === t ? "text-sky-400" : ""}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <h2 className="text-lg font-semibold">
            {country.name.common}
          </h2>
          <p>Region: {country.region}</p>
          <p>Population: {country.population}</p>
        </div>
      )}

      {tab === "charts" && (
        <div>Charts coming (CSS charts)</div>
      )}

      {tab === "related" && (
        <div>Related data here</div>
      )}
    </div>
  );
};

export default CountryDetail;
