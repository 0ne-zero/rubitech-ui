/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: { colors: { primary: { DEFAULT: "#0F766E" }, accent: { DEFAULT: "#DC2626" } } },
  },
  plugins: [],
};
