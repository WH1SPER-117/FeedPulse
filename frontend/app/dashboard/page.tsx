"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  type SummaryType = {
    total: number;
    bySentiment: {
      Positive?: number;
      Negative?: number;
      Neutral?: number;
      null?: number;
    };
    byStatus?: {
      [key: string]: number;
    };
    byCategory?: {
      [key: string]: number;
    };
    avgPriority: number;
  };
  const sentimentOrder = ["Negative", "Positive", "Mixed", "Neutral", "null"];
  const [summary, setSummary] = useState<SummaryType>({
    total: 0,
    bySentiment: {},
    byStatus: {},
    avgPriority: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchFeedbacks();
  }, [page]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback?page=${page}&limit=10`
      );

      const data = await res.json();

      if (data.success) {
        setFeedbacks(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/feedback/summary");
    const data = await res.json();

    if (data.success) {
      setSummary(data.data);
    }
  } catch (err) {
    console.error("Failed to fetch summary");
  }
};

  //  Basic stats
  const total = summary.total;
  const positive = summary.bySentiment?.Positive || 0;
  const negative = summary.bySentiment?.Negative || 0;

  // Open Items
  const openItems = summary.byStatus?.["In Review"] || 0;

  // Most Common Tag
  const tagCount: Record<string, number> = {};
  // Avg Priority
  const avgPriority = summary.avgPriority || 0;
  feedbacks.forEach((f) => {
    (f.ai_tags || []).forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const mostCommonTag =
    Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const pending =
    (summary.bySentiment?.Neutral || 0) +
    (summary.bySentiment?.null || 0);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("date"); // date | priority | sentiment
  const [sortOrder, setSortOrder] = useState("desc"); // desc | asc

  const filteredData = feedbacks
    .filter((f) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(f.category);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(f.status);

      const matchesSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.ai_tags || [])
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortBy === "priority") {
        return sortOrder === "desc"
          ? (b.ai_priority || 0) - (a.ai_priority || 0)
          : (a.ai_priority || 0) - (b.ai_priority || 0);
      }

      if (sortBy === "sentiment") {
        const map: any = { Positive: 3, Neutral: 2, Negative: 1 };

        return sortOrder === "desc"
          ? (map[b.ai_sentiment] || 0) - (map[a.ai_sentiment] || 0)
          : (map[a.ai_sentiment] || 0) - (map[b.ai_sentiment] || 0);
      }

      return 0;
    });

  return (
   <div className="min-h-screen bg-gray-100 p-6">

  <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
    Admin Dashboard
  </h1>

  {/* 🔹 Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-500 text-sm">Total Feedback</p>
    <h2 className="text-2xl font-bold text-gray-800">{total}</h2>
  </div>

  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-500 text-sm">Open Items</p>
    <h2 className="text-blue-600 text-2xl font-bold">{openItems}</h2>
  </div>

  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-500 text-sm">Average Priority</p>
    <h2 className="text-purple-600 text-2xl font-bold">
      {avgPriority.toFixed(1)}
    </h2>
  </div>

  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-500 text-sm">Most Common Tag</p>
    <h2 className="text-green-600 text-xl font-semibold">
      {mostCommonTag}
    </h2>
  </div>

  </div>
  <div className="bg-white p-5 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Feedback by Category
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {Object.entries(summary.byCategory || {}).map(([key, value]) => (
        <div key={key} className="bg-gray-50 p-3 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">{key}</p>
          <p className="text-xl font-bold text-gray-800">{value as number}</p>
        </div>
      ))}

    </div>
  </div>
  <div className="bg-white p-5 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Sentiment Breakdown
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

      {sentimentOrder.map((key) => {
        const value = summary.bySentiment?.[key as keyof typeof summary.bySentiment] || 0;

        return (
          <div key={key} className="bg-gray-50 p-4 rounded-lg shadow text-center">
            <p className="text-gray-500">{key}</p>
            <h3 className="text-xl font-bold text-gray-800">{value}</h3>
          </div>
        );
      })}

    </div>
  </div>


  <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-5 border">

  {/* 🔹 Category */}
  <div>
    <p className="font-semibold text-gray-800 mb-2">Category</p>
    <div className="flex flex-wrap gap-4 text-gray-700">
      {["Bug", "Feature Request", "Improvement", "Other"].map((cat) => (
        <label key={cat} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-blue-600 w-4 h-4"
            checked={selectedCategories.includes(cat)}
            onChange={() => {
              setSelectedCategories((prev) =>
                prev.includes(cat)
                  ? prev.filter((c) => c !== cat)
                  : [...prev, cat]
              );
            }}
          />
          {cat}
        </label>
      ))}
    </div>
  </div>

  {/* 🔹 Status */}
  <div>
    <p className="font-semibold text-gray-800 mb-2">Status</p>
    <div className="flex flex-wrap gap-4 text-gray-700">
      {["New", "In Review", "Resolved"].map((status) => (
        <label key={status} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-blue-600 w-4 h-4"
            checked={selectedStatuses.includes(status)}
            onChange={() => {
              setSelectedStatuses((prev) =>
                prev.includes(status)
                  ? prev.filter((s) => s !== status)
                  : [...prev, status]
              );
            }}
          />
          {status}
        </label>
      ))}
    </div>
  </div>

  {/* 🔹 Search + Sort Row */}
  <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">

    {/* LEFT */}
    <input
      placeholder="Search by title or summary..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded-md w-full md:flex-1 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
    />

    {/* RIGHT */}
    <div className="flex items-center gap-3 ml-auto">

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500"
      >
        <option value="date">Sort by Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="sentiment">Sort by Sentiment</option>
      </select>

      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
        }
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
      >
        Change Order
      </button>

    </div>
  </div>
</div>

  {/* 🔹 Table */}
  <div className="bg-white rounded-lg shadow overflow-hidden">

    {loading ? (
      <p className="p-4 text-gray-600">Loading...</p>
    ) : (
      <table className="w-full text-left text-sm">

        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3">Sentiment</th>
            <th className="p-3">Priority</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((f) => (
            <tr
              key={f._id}
              onClick={() => router.push(`/dashboard/${f._id}`)}
              className="border-t hover:bg-gray-50 cursor-pointer"
            >

              <td className="p-3 font-medium text-gray-800">
                {f.title}
              </td>

              <td className="p-3 text-gray-700">
                {f.category}
              </td>

              <td className="p-3 text-gray-700">
                {f.status}
              </td>

              <td className="p-3 text-gray-700">
                {new Date(f.createdAt).toLocaleDateString()}
              </td>

              <td className={`p-3 font-medium ${
                f.ai_sentiment === "Positive"
                  ? "text-green-600"
                  : f.ai_sentiment === "Negative"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}>
                {f.ai_sentiment || "—"}
              </td>

              <td className="p-3 text-gray-700">
                {f.ai_priority || "—"}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    )}
  </div>
  <div className="flex justify-center items-center gap-4 mt-6">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 bg-blue-700 rounded disabled:opacity-50"
    >
      Prev
    </button>

    <span className="text-gray-700 font-medium">
      Page {page} of {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 bg-blue-700 rounded disabled:opacity-50"
    >
      Next
    </button>

  </div>


</div>
  );
}