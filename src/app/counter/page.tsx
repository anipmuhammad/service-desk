'use client';

import { useEffect, useState } from 'react';

type Ticket = {
  queue: string;
  counter: string;
  status: string;
};

export default function CounterDisplayPage() {
  const [counters, setCounters] = useState<{ [key: string]: string }>({
    'Counter 1': '-',
    'Counter 2': '-',
    'Counter 3': '-',
    'Counter 4': '-',
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/get-queue');
      const data: Ticket[] = await res.json();

      const latestByCounter: { [key: string]: string } = {};
      for (const row of data) {
        if (row.counter && row.status !== 'Resolved') {
          latestByCounter[row.counter] = row.queue;
        }
      }

      setCounters({
        'Counter 1': latestByCounter['Counter 1'] || '-',
        'Counter 2': latestByCounter['Counter 2'] || '-',
        'Counter 3': latestByCounter['Counter 3'] || '-',
        'Counter 4': latestByCounter['Counter 4'] || '-',
      });
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Live Counter Display</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {Object.entries(counters).map(([counter, queue]) => (
          <div
            key={counter}
            className="border rounded-lg shadow-md p-6 bg-sky-50 text-center"
          >
            <h2 className="text-2xl font-semibold mb-4 text-black">{counter}</h2>
            <p className="text-6xl font-bold text-black">{queue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
