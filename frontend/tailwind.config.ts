import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      crayon: ['"DK Crayon Crumble"', "cursive"],
      comic: ["Unkempt", "cursive"],
      school: ["Unkempt", "cursive"]
    },
    extend: {
      screens: {
        custom: "1000px",
        vsm: { max: "450px" },
        sm: { max: "600px" },
        mid: { max: "1200px" },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-yellow": "#FCD800",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
export default config;
