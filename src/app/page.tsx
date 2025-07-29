import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        {/* Clickable Logo on the left */}
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

        {/* Navigation on the right */}
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
        <div className="w-full max-w-xl mb-6">
          <Image
            src="/sb1.png"
            alt="Service Desk"
            width={800}
            height={400}
            className="rounded shadow-md object-cover w-full"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to the IT Service Desk
        </h1>
        <p className="text-lg text-gray-600 text-center mb-6">
          Request support for your IT-related issues.
        </p>

        <Link href="/kiosk">
          <button className="px-6 py-3 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 transition">
            Go to Service Desk
          </button>
        </Link>
      </main>
    </div>
  );
}
