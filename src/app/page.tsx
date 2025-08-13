// /src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/swinburnelogo.png"
              alt="Swinburne Logo"
              width={150}
              height={150}
              priority
              className="cursor-pointer"
            />
            <span className="text-xl font-bold">IT Service Desk</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          <Link
            href="/"
            className="hover:text-sky-600 font-bold transition-colors"
          >
            Home
          </Link>
          <Link
            href="/kiosk"
            className="hover:text-sky-600 font-bold transition-colors"
          >
            Service Desk
          </Link>
          <Link
            href="/login"
            className="hover:text-sky-600 font-bold transition-colors"
          >
            Admin
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10 w-full max-w-screen-xl mx-auto">
        {/* Hero Image */}
        <div className="w-full mb-6">
          <Image
            src="/sb1.png"
            alt="Service Desk"
            width={1920}
            height={400}
            priority
            className="rounded shadow-md object-cover w-full"
          />
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to the IT Service Desk
        </h1>
        <p className="text-lg text-gray-600 text-center mb-6">
          Request support for your IT-related issues.
        </p>

        {/* CTA Button */}
        <Link href="/kiosk">
          <button className="px-6 py-3 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 transition-colors">
            Go to Service Desk
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 text-gray-500 text-center text-xs py-4 mt-10">
        <p>© Swinburne University of Technology Sarawak Campus 2025 | Copyright and disclaimer</p>
      </footer>
    </div>
  );
}
