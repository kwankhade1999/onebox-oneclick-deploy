module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a855f7",
        darkBg: "#0e0e0f",
        cardBg: "#151518",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        oneboxdark: {
          primary: "#a855f7",
          secondary: "#9333ea",
          accent: "#c084fc",
          neutral: "#1a1a1d",
          "base-100": "#0e0e0f",
          "base-200": "#151518",
          "base-300": "#1f1f23",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
    darkTheme: "oneboxdark",
  },
};
