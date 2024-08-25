/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: "1fr auto",
        layout: "3fr 1fr",
      },
    },
  },
  plugins: [],
};
