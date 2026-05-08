import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        mist: "#F6F6F6",
        coral: "#D62F2F",
        sage: "#2F8D46",
        gold: "#E4B84C",
        slate: "#666666"
      },
      boxShadow: {
        soft: "0 18px 42px -28px rgba(0, 0, 0, 0.45)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      backgroundImage: {}
    }
  },
  plugins: []
};

export default config;
