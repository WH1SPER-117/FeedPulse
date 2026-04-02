"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    toast.success("Admin signed out");

    router.push("/");
  };

  return (
    <div className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      
      {/* Logo */}
      <div className="font-bold text-lg text-blue-600">
        FeedPulse
        {/* later replace with your image */}
      </div>

      {/* Auth Button */}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      ) : (
        <Link href="/login">
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}