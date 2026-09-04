/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "var(--color-primary, #D21F26)",
          charcoal: "#171717",
          ink: "#111111",
          offwhite: "#F7F5F0",
          mist: "#EEEEEA",
          grey: "#666666",
          success: "#198754",
          warning: "#F59E0B",
          error: "#D93025"
        }
      },
      fontFamily: { sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"] }
    }
  },
  plugins: []
};
