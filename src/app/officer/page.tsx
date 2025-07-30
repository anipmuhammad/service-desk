'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function OfficerPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuth(true);
      fetchQueue();

      const interval = setInterval(fetchQueue, 5000);
      return () => clearInterval(interval);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/get-queue");
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  };

  const handleResolve = async (index: number) => {
    try {
      await fetch("/api/resolve-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex: index + 1 }),
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAssignCounter = async (index: number, counter: string) => {
    try {
      await fetch("/api/assign-counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex: index + 1, counter }),
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to assign counter:", err);
    }
  };

  if (!isAuth) return null;

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
          <span className="text-xl font-bold">IT Service Desk - Officer</span>
        </div>

        <nav className="flex gap-6">
          <Link href="/">
            <span className="hover:text-sky-600 font-bold cursor-pointer">Home</span>
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("isAuthenticated");
              router.push("/login");
            }}
            className="text-red-600 font-bold hover:text-red-800"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-start flex-1 px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Active Queue Table</h1>

        <div className="overflow-x-auto w-full max-w-6xl">
          {queue.length === 0 ? (
            <p className="text-gray-600 text-lg text-center">No active tickets right now.</p>
          ) : (
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-sky-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 border">Queue #</th>
                  <th className="py-3 px-4 border">Email</th>
                  <th className="py-3 px-4 border">Issue</th>
                  <th className="py-3 px-4 border">Counter</th>
                  <th className="py-3 px-4 border">Status</th>
                  <th className="py-3 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      row.status === "Resolved"
                        ? "bg-green-50 text-green-800"
                        : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-4 border font-semibold">{row.queue}</td>
                    <td className="py-2 px-4 border">{row.email}</td>
                    <td className="py-2 px-4 border">{row.issue}</td>
                    <td className="py-2 px-4 border">
                      {row.status !== "Resolved" ? (
                        <select
                          className="border rounded px-2 py-1 text-sm text-sky-700"
                          value={row.counter || ""}
                          onChange={(e) => handleAssignCounter(row.index, e.target.value)}
                        >
                          <option value="">—</option>
                          <option value="Counter 1">Counter 1</option>
                          <option value="Counter 2">Counter 2</option>
                          <option value="Counter 3">Counter 3</option>
                        </select>
                      ) : (
                        <span className="text-sky-700 font-semibold">{row.counter || "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border font-medium">{row.status}</td>
                    <td className="py-2 px-4 border">
                      {row.status !== "Resolved" ? (
                        <button
                          onClick={() => handleResolve(row.index)}
                          className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                        >
                          Mark as Resolved
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
