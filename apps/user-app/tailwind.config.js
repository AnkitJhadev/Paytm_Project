module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx.mdx}",
      "./src/**/*.{js,jsx,ts,tsx}",              // Your app's source files
      "../../packages/ui/src/**/*.{js,jsx,ts,tsx}"   // Shared UI components
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  