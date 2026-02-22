import { useState } from "react";
import { useGetPostsQuery } from "../../api/postApi";
import { mapApiState } from "../../utils/apistate";
import DataTable from "../generic/DataTable";
import type { ColumnDef } from "../generic/DataTable";
import CardGrid from "../generic/CardGrid";
import type { Post } from "../../types/post";

type View = "table" | "grid";

const PostsWidget = () => {
  const [view, setView] = useState<View>("grid");

  const query = useGetPostsQuery();
  const state = mapApiState(query);

  if (state.status === "idle")    return <div className="p-4">Waiting...</div>;
  if (state.status === "loading") return <div className="p-4">Loading Posts....</div>;
  if (state.status === "error")   return <div className="p-4">Posts Unavailable</div>;

  const posts = state.data.slice(0, 10);

  const columns: ColumnDef<Post>[] = [
    {
      header: "ID",
      accessor: "id",
    },
    {
      header: "Title",
      accessor: "title",
      render: (v: unknown) => (
        <span className="capitalize">{String(v)}</span>
      ),
    },
    {
      header: "Body",
      accessor: "body",
      render: (v: unknown) => (
        <span className="text-gray-400 line-clamp-1">{String(v)}</span>
      ),
    },
  ];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 md:p-6 text-white shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Community Posts</h2>

        {/* Toggle */}
        <div className="flex gap-2">
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

      {/* Grid view */}
      {view === "grid" && (
        <CardGrid<Post>
          items={posts}
          renderItem={(post) => (
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition h-full">
              <p className="text-xs text-gray-500 mb-1">#{post.id}</p>
              <h3 className="font-medium capitalize text-sm mb-1">{post.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{post.body}</p>
            </div>
          )}
        />
      )}

      {/* Table view */}
      {view === "table" && (
        <DataTable<Post>
          data={posts}
          columns={columns}
          sortable
        />
      )}
    </div>
  );
};

export default PostsWidget;