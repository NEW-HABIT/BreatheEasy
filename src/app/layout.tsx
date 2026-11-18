import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'BreatheEasy — Fresh Air & Family Wellness Guide',
  description: 'AI-powered air quality shield for families to navigate smog, fresh air windows, easy indoor hacks, and daily wellness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
