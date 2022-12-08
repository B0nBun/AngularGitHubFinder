/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "gh-gray-50":  "#f6f8fa",
        "gh-gray-100": "#eaeef2",
        "gh-gray-200": "#d0d7de",
        "gh-gray-300": "#afb8c1",
        "gh-gray-400": "#8c959f",
        "gh-gray-500": "#6e7781",
        "gh-gray-600": "#57606a",
        "gh-gray-700": "#424a53",
        "gh-gray-800": "#32383f",
        "gh-gray-900": "#24292f",
      }
    },
    keyframes: {
      rotate: {
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      }
    },
    animation: {
      'loading-rotation': 'rotate 1s infinite'
    }
  },
  plugins: [],
}
