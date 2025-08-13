'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function OfficerPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [officerCounter, setOfficerCounter] = useState<string | null>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [assignedCounters, setAssignedCounters] = useState<string[]>([]);
  const [openCounters, setOpenCounters] = useState(4);

  // Filters
  const [filterCounter, setFilterCounter] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const ALL_COUNTERS = [
    "Counter 1", "Counter 2", "Counter 3", "Counter 4",
    "Counter 5", "Counter 6", "Counter 7", "Counter 8",
  ];

  const COUNTERS = ALL_COUNTERS.slice(0, openCounters);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const storedRole = sessionStorage.getItem("role");
    const storedCounter = sessionStorage.getItem("officerCounter");

    if (auth === "true" && storedRole) {
      setIsAuth(true);
      setRole(storedRole);
      setOfficerCounter(storedCounter);
      fetchQueue(storedRole, storedCounter);
      const interval = setInterval(() => fetchQueue(storedRole, storedCounter), 5000);
      return () => clearInterval(interval);
    } else {
      router.push("/login");
    }
  }, [router, openCounters]);

  const fetchQueue = async (userRole: string | null, officerCounter: string | null) => {
    try {
      const res = await fetch("/api/get-queue");
      const data = await res.json();

      if (userRole === "officer" && officerCounter) {
        setQueue(data.filter((row: any) => row.status !== "Resolved" && row.counter === officerCounter));
      } else {
        setQueue(data);

        const activeCounters = data
          .filter((row: any) => row.status !== "Resolved" && row.counter)
          .map((row: any) => row.counter);
        setAssignedCounters(activeCounters);

        // Auto-assign counters
        const availableCounters = COUNTERS.filter(c => !activeCounters.includes(c));
        for (const ticket of data) {
          if (ticket.status !== "Resolved" && !ticket.counter && availableCounters.length > 0) {
            const counterToAssign = availableCounters.shift();
            if (counterToAssign) {
              await fetch("/api/assign-counter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rowIndex: ticket.rowIndex, counter: counterToAssign }),
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  };

  const handleResolve = async (rowIndex: number) => {
    try {
      await fetch("/api/resolve-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex }),
      });
      fetchQueue(role, officerCounter);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAssignCounter = async (rowIndex: number, counter: string) => {
    if (role !== "admin") return;
    try {
      await fetch("/api/assign-counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex, counter }),
      });
      fetchQueue(role, officerCounter);
    } catch (err) {
      console.error("Failed to assign counter:", err);
    }
  };

  const filteredQueue = queue.filter((row) => {
    // Compute display status first
    const displayStatus = row.status === "Resolved"
      ? "Resolved"
      : row.counter
      ? "In Progress"
      : "Pending";

    const matchCounter = filterCounter === "All" || row.counter === filterCounter;
    const matchStatus = filterStatus === "All" || displayStatus === filterStatus;

    return matchCounter && matchStatus;
  });

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
          <span className="text-xl font-bold">
            IT Service Desk - {role === "admin" ? "Admin" : `Officer (${officerCounter})`}
          </span>
        </div>

        <nav className="flex gap-6">
          <Link href="/">
            <span className="hover:text-sky-600 font-bold cursor-pointer">Home</span>
          </Link>
          <button
            onClick={() => {
              sessionStorage.clear();
              router.push("/login");
            }}
            className="text-red-600 font-bold hover:text-red-800"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-start flex-1 px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {role === "admin" ? "Active Queue Table" : "My Tickets"}
        </h1>

        {role === "admin" && (
          <>
            {/* Open Counters Selector */}
            <div className="mb-4 flex items-center gap-3">
              <label className="font-semibold">Open Counters:</label>
              <select
                value={openCounters}
                onChange={(e) => setOpenCounters(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1"
              >
                {ALL_COUNTERS.map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center gap-6">
              <div>
                <label className="font-semibold mr-2">Filter by Counter:</label>
                <select
                  value={filterCounter}
                  onChange={(e) => setFilterCounter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1"
                >
                  <option value="All">All</option>
                  {COUNTERS.map((counter) => (
                    <option key={counter} value={counter}>
                      {counter}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold mr-2">Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="overflow-x-auto w-full max-w-6xl">
          {filteredQueue.length === 0 ? (
            <p className="text-gray-600 text-lg text-center">No tickets match your filters.</p>
          ) : (
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-sky-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 border">Queue #</th>
                  <th className="py-3 px-4 border">Email</th>
                  <th className="py-3 px-4 border">Issue</th>
                  {role === "admin" && <th className="py-3 px-4 border">Counter</th>}
                  <th className="py-3 px-4 border">Status</th>
                  <th className="py-3 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((row) => {
                  const displayStatus = row.status === "Resolved"
                    ? "Resolved"
                    : row.counter
                    ? "In Progress"
                    : "Pending";

                  return (
                    <tr key={row.rowIndex} className="bg-white">
                      <td className="py-2 px-4 border font-semibold">{row.queue}</td>
                      <td className="py-2 px-4 border">{row.email}</td>
                      <td className="py-2 px-4 border">{row.issue}</td>
                      {role === "admin" && (
                        <td className="py-2 px-4 border">
                          <div className="flex gap-1 flex-wrap">
                            {COUNTERS.map((counter) => {
                              const isCounterTaken =
                                assignedCounters.includes(counter) && row.counter !== counter;
                              const isResolved = row.status === "Resolved";

                              return (
                                <button
                                  key={counter}
                                  disabled={isCounterTaken || isResolved}
                                  onClick={() => handleAssignCounter(row.rowIndex, counter)}
                                  className={`px-2 py-1 text-xs rounded font-medium border 
                                    ${
                                      row.counter === counter
                                        ? "bg-sky-600 text-white"
                                        : "bg-white text-sky-700 border-sky-600 hover:bg-sky-100"
                                    } 
                                    ${
                                      (isCounterTaken || isResolved)
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }
                                  `}
                                >
                                  {counter.split(" ")[1]}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                      <td className="py-2 px-4 border font-medium">{displayStatus}</td>
                      <td className="py-2 px-4 border">
                        {displayStatus !== "Resolved" && (
                          <button
                            onClick={() => handleResolve(row.rowIndex)}
                            className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                          >
                            Mark as Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
