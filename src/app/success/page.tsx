'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queue = searchParams.get("queue");
    setQueueNumber(queue);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Processing...</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Request Submitted!
          </h1>
          {queueNumber ? (
            <>
              <p className="text-xl font-semibold">
                Your Queue Number:
              </p>
              <p className="text-4xl font-bold mt-2 text-blue-700">
                {queueNumber}
              </p>
            </>
          ) : (
            <p className="text-lg text-red-500">No queue number found.</p>
          )}
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
