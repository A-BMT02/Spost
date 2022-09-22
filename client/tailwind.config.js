/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      lblue: "#F8FAFC",
      dblue: "#426FB7",
      owhite: "#FFFFFF",
      ogray: "#6C6C6C",
      lgray: "#d1d1d1",
      lwhite: "#F9FAFC",
      ogray: "#8B8686",
      ored: "#FF0000",
      ogreen: "#3CB35A",
    },
    extend: {
      fontFamily: {
        a: ["'Alex Brush'", "cursive"],
        inter: ["Inter", "sans-serif"],
      },
      width: {
        1: "100%",
        "2p": "200%",
        "3p": "300%",
        "4p": "400%",
        "5p": "500%",
        "6p": "600%",
        "7p": "700%",
        "8p": "800%",
        "1/2p": "50%",
        "1/3p": "33.33%",
        "1/4p": "25%",
        "1/5p": "20%",
        "1/6p": "16.66%",
        "1/7p": "700%",
        "1/8p": "800%",
      },
    },
  },
};
