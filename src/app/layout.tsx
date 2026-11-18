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
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
