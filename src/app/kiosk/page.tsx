'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Kiosk() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSelect = (service: string) => {
    setSelectedService((prev) => (prev === service ? null : service));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService && email) {
      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, service: selectedService }),
        });

        if (res.ok) {
          const data = await res.json();
          const queueNumber = data.queueNumber;

          setEmail("");
          setSelectedService(null);

          // ✅ Redirect with queue number
          router.push(`/success?queue=${queueNumber}`);
        } else {
          alert("❌ Failed to submit request.");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Error submitting request.");
      }
    }
  };

  const services = [
    "Password Reset / MFA",
    "PC Broken",
    "Internet Problem",
    "Software Installation",
    "Email Access Issue",
    "Other",
  ];

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

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Service Desk Request
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-6 items-center"
        >
          {/* Service Buttons */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {services.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handleSelect(service)}
                className={`py-2 px-4 rounded border font-medium transition-colors duration-200 text-sm ${
                  selectedService === service
                    ? "bg-sky-500 text-white border-sky-500"
                    : "bg-white text-black border-gray-300 hover:bg-sky-100"
                }`}
              >
                {service}
              </button>
            ))}
          </div>

          {/* Email Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedService || !email}
            className={`w-full py-2 rounded font-semibold transition ${
              selectedService && email
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Submit Request
          </button>
        </form>
      </main>
    </div>
  );
}
