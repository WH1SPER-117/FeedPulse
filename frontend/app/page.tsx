"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "", // success | error | info | warning
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.description.length < 20) {
      setToast({
        message: "Description must be at least 20 characters.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setToast({
          message: "Your feedback has been submitted successfully.",
          type: "success",
        });

        setForm({
          title: "",
          description: "",
          category: "Bug",
          submitterName: "",
          submitterEmail: "",
        });
      } else {
        setToast({
          message: data.message || "Something went wrong.",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "Server error. Try again.",
        type: "error",
      });
    }

    setLoading(false);

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">

      {/* Toast */}
      {toast.message && (
        <div className="absolute top-5 right-5 w-80 bg-white shadow-lg rounded-md border flex overflow-hidden">

          {/* Left Color Bar */}
          <div
            className={`w-1 ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "info"
                ? "bg-blue-500"
                : "bg-yellow-500"
            }`}
          />

          {/* Content */}
          <div className="flex items-start gap-3 p-4 w-full">

            {/* Icon */}
            <div className="text-lg">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
              {toast.type === "warning" && "⚠️"}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800 capitalize">
                {toast.type}
              </p>
              <p className="text-sm text-gray-500">
                {toast.message}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setToast({ message: "", type: "" })}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">

        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Feedback Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              placeholder="Enter feedback title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2
              text-gray-900 placeholder-gray-400 bg-gray-50
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your feedback..."
              value={form.description}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 h-28
              text-gray-900 placeholder-gray-400 bg-gray-50
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />

            {/* Character Counter */}
            <p
              className={`text-xs mt-1 ${
                form.description.length < 20
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {form.description.length} / 20 characters minimum
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2
              text-gray-900 bg-gray-50
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            >
              <option>Bug</option>
              <option>Feature Request</option>
              <option>Improvement</option>
              <option>Other</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Your Name (optional)
            </label>
            <input
              name="submitterName"
              placeholder="John Doe"
              value={form.submitterName}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2
              text-gray-900 placeholder-gray-400 bg-gray-50
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Your Email (optional)
            </label>
            <input
              name="submitterEmail"
              placeholder="example@email.com"
              value={form.submitterEmail}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2
              text-gray-900 placeholder-gray-400 bg-gray-50
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}