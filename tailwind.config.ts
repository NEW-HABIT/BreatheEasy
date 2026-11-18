import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: "#10B981",
          moderate: "#FBBF24",
          unhealthySensitive: "#F97316",
          unhealthy: "#EF4444",
          veryUnhealthy: "#8B5CF6",
          hazardous: "#7F1D1D",
        },
        glass: {
          white: "rgba(255,255,255,0.72)",
          "white-strong": "rgba(255,255,255,0.88)",
          border: "rgba(255,255,255,0.45)",
          "green-shadow": "rgba(16,185,129,0.08)",
        },
        brand: {
          green: "#059669",
          teal: "#0d9488",
          emerald: "#10b981",
        },
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-up": "slide-up 0.5s ease-out both",
        "spin-slow": "spin-slow 8s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.215,0.61,0.355,1) infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.85" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-8px) translateX(4px)" },
          "66%": { transform: "translateY(4px) translateX(-4px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "70%": { transform: "scale(1.4)", opacity: "0.1" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(16,185,129,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        "glass-hover":
          "0 12px 40px rgba(16,185,129,0.14), 0 4px 12px rgba(0,0,0,0.06)",
        "green-glow": "0 4px 16px rgba(5,150,105,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
