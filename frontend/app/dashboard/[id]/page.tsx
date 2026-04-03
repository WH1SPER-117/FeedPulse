"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FeedbackDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchFeedback = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/${id}`
      );
      const json = await res.json();
      setData(json.data);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  //  UPDATE STATUS
  const updateStatus = async (status: string) => {
    setActionLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Status updated");
      fetchFeedback();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE
  const deleteFeedback = async () => {

    setActionLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Deleted successfully");
      router.push("/dashboard");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  // REGENERATE AI
  const regenerateAI = async () => {
    setActionLoading(true);
    toast(
    "AI analysis may take a few seconds. If the system is experiencing high demand, regeneration may fail. Please wait...",
    {
        icon: "⏳",
        duration: 4000,
    }
    );
    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/${id}/regenerate-ai`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("AI summary regenerated");
      fetchFeedback();
    } catch {
      toast.error("AI summery regeneration failed! Please try again later.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

        {/*  HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/*  TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {data.title}
        </h1>

        {/*  DESCRIPTION */}
        <p className="text-gray-600 mb-6">
          {data.description}
        </p>

        {/*  DETAILS */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">

          <p><b>Category:</b> {data.category}</p>
          <p><b>Status:</b> {data.status}</p>
          <p><b>Sentiment:</b> {data.ai_sentiment || "—"}</p>
          <p><b>Priority:</b> {data.ai_priority || "—"}</p>

          <div className="col-span-2">
            <b>Summary:</b>
            <p className="mt-1 text-gray-600">
              {data.ai_summary || "No AI summary yet"}
            </p>
          </div>

        </div>

        {/*  ACTIONS */}
        <div className="flex gap-3 flex-wrap mt-6">

          {data.status === "New" && (
            <button
              disabled={actionLoading}
              onClick={() => updateStatus("In Review")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Move to In Review
            </button>
          )}

          {data.status === "In Review" && (
            <button
              disabled={actionLoading}
              onClick={() => updateStatus("Resolved")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Mark as Resolved
            </button>
          )}

          {data.status === "Resolved" && (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Already Resolved
            </button>
          )}

            <button
            disabled={actionLoading}
            onClick={regenerateAI}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
            {actionLoading ? "Processing..." : "Regenerate AI"}
            </button>

          <button
            disabled={actionLoading}
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>

        </div>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirm Deletion
            </h2>

            <p className="text-gray-600 mb-6">
                Are you sure you want to delete this feedback? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

                <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                Cancel
                </button>

                <button
                onClick={async () => {
                    setShowDeleteModal(false);
                    await deleteFeedback();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                Delete
                </button>

            </div>

            </div>
        </div>
        )}
    </div>
  );
}