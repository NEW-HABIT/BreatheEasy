import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BreatheEasy — GenAI Urban Air Quality Assistant',
  description: 'AI-powered air quality shield for families and communities to navigate severe winter smog, indoor air quality hacks, and quantified sustainable routines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
