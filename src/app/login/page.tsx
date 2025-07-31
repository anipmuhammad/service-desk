'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "officer" && password === "password123") {
      sessionStorage.setItem("isAuthenticated", "true");
      router.push("/officer");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/swinburnelogo.png"
              alt="Logo"
              width={150}
              height={150}
              className="cursor-pointer"
            />
          </Link>
          <span className="text-xl font-bold">IT Service Desk</span>
        </div>

        <nav className="flex gap-6">
          <Link href="/">
            <span className="hover:text-sky-600 font-bold cursor-pointer">Home</span>
          </Link>
          <Link href="/kiosk">
            <span className="hover:text-sky-600 font-bold cursor-pointer">Service Desk</span>
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Officer Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm flex flex-col gap-6 items-center bg-white border border-gray-200 rounded-lg p-6 shadow"
        >
          {error && (
            <p className="text-red-500 text-sm font-medium w-full text-center">{error}</p>
          )}

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
