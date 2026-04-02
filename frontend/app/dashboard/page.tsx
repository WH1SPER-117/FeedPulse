"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/feedback");
      const data = await res.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Basic stats
  const total = feedbacks.length;
  const positive = feedbacks.filter(f => f.ai_sentiment === "Positive").length;
  const negative = feedbacks.filter(f => f.ai_sentiment === "Negative").length;
  const pending = feedbacks.filter(f => f.status === "New").length;

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
        (f.ai_summary || "")
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
      <p className="text-gray-500 text-sm">Positive</p>
      <h2 className="text-green-600 text-2xl font-bold">{positive}</h2>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">Negative</p>
      <h2 className="text-red-600 text-2xl font-bold">{negative}</h2>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">New</p>
      <h2 className="text-blue-600 text-2xl font-bold">{pending}</h2>
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
  <div className="flex flex-col md:flex-row md:items-center gap-4">

    {/* Search */}
    <input
      placeholder="Search by title or summary..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
    />

    {/* Sort By */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500"
    >
      <option value="date">Sort by Date</option>
      <option value="priority">Sort by Priority</option>
      <option value="sentiment">Sort by Sentiment</option>
    </select>

    {/* Sort Order Toggle */}
    <button
      onClick={() =>
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
      }
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      {sortBy === "date"
        ? sortOrder === "desc"
          ? "Newest → Oldest"
          : "Oldest → Newest"
        : sortBy === "priority"
        ? sortOrder === "desc"
          ? "High → Low"
          : "Low → High"
        : sortOrder === "desc"
        ? "Positive → Negative"
        : "Negative → Positive"}
    </button>

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
            <th className="p-3">Sentiment</th>
            <th className="p-3">Priority</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((f) => (
            <tr key={f._id} className="border-t hover:bg-gray-50">

              <td className="p-3 font-medium text-gray-800">
                {f.title}
              </td>

              <td className="p-3 text-gray-700">
                {f.category}
              </td>

              <td className="p-3 text-gray-700">
                {f.status}
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
</div>
  );
}