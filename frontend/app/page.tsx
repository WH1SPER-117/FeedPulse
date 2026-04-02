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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Feedback submitted!");
      setForm({
        title: "",
        description: "",
        category: "Bug",
        submitterName: "",
        submitterEmail: "",
      });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">

        {/* Header */}

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
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}