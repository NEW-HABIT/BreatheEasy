import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" role="main" className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50">
      {children}
    </main>
  );
}
