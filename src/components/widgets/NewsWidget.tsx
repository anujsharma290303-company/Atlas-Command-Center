import { useState } from "react";
import {
  useGetTopHeadlinesQuery,
  useSearchNewsQuery,
} from "../../api/newsApi";
import { mapApiState } from "../../utils/apistate";
import CardGrid from "../generic/CardGrid";
import type { NewsArticle } from "../../types/news"; 

const NewsWidget = () => {
  const [search, setSearch] = useState("");

  const headlinesQuery = useGetTopHeadlinesQuery("us");
  const state = mapApiState(headlinesQuery);

  const { data: headlines } = headlinesQuery;

  const { data: searchResults } = useSearchNewsQuery(search, {
    skip: search.length < 3,
  });

  const articles: NewsArticle[] =
    search.length >= 3
      ? (searchResults?.articles ?? [])
      : (headlines?.articles ?? []);

  if (state.status === "loading") return <div className="p-4">Loading news...</div>;
  if (state.status === "error") return <div className="p-4">News unavailable</div>;
  if (!articles.length) return <div className="p-4">News unavailable</div>;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 text-white shadow-md">
      <h2 className="text-lg font-semibold mb-3">News Feed</h2>

      <input
        type="text"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-sky-400"
      />

      <CardGrid<NewsArticle>
        items={articles.slice(0, 6)}
        renderItem={(article) => (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="block hover:bg-white/5 p-3 rounded-lg transition h-full"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt=""
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <h3 className="font-medium text-sm">{article.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{article.source.name}</p>
          </a>
        )}
      />
    </div>
  );
};

export default NewsWidget;