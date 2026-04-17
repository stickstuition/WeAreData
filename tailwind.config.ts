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
        ink: "#11243D",
        mist: "#F5F7FB",
        coral: "#F66B4E",
        sage: "#6D9F71",
        gold: "#E4B84C",
        slate: "#6C788A"
      },
      boxShadow: {
        soft: "0 24px 50px -24px rgba(17, 36, 61, 0.35)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(246,107,78,0.22), transparent 30%), radial-gradient(circle at top right, rgba(109,159,113,0.22), transparent 26%), linear-gradient(180deg, #fffefb 0%, #f5f7fb 100%)"
      }
    }
  },
  plugins: []
};

export default config;
