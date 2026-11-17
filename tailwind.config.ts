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
          good: "#10B981", // green
          moderate: "#FBBF24", // yellow
          unhealthySensitive: "#F97316", // orange
          unhealthy: "#EF4444", // red
          veryUnhealthy: "#8B5CF6", // purple
          hazardous: "#7F1D1D", // maroon
        },
      },
    },
  },
  plugins: [],
};
export default config;
