/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cyber-lime": "#CCFF00",
        "obsidian":   "#080A0C",
        "ice":        "#F0F7FF",
        "ice-dim":    "#B8D4EE",
        "void":       "#04060A",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body:    ["'Space Grotesk'", "sans-serif"],
      },
      backdropBlur: {
        glass: "24px",
      },
    },
  },
  plugins: [],
}
