// /app/layout.tsx
import './globals.css';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Service Desk Kiosk',
  description: 'Self-service queue system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
