/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-short": "bounce 1s ease-in-out 4.5",
        "one-bounce": "bounce 1s ease-in-out 0.5",
      },
    },
  },
  plugins: [],
};
