import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct colors for basic utility classes
        background: "#0c0612", // This creates the bg-background class
        foreground: "#ffffff", // This creates the text-foreground class

        // Keep your nested structure for variants
        "background-lighter": "#1a1522",
        "background-card": "#241b2e",
        "background-dark": "#080309",
        // Enhanced color palette with new gradient colors
        primary: {
          DEFAULT: "#8f46c1",
          dark: "#7a35ad",
          light: "#a362d6",
          secondary: "#d56f66",
          // Gradient colors
          start: "#8f46c1",
          end: "#d56f66",
          // Additional shades
          50: "#f3e8fa",
          100: "#e6d1f5",
          200: "#d0a7eb",
          300: "#b97ee0",
          400: "#a362d6",
          500: "#8f46c1",
          600: "#7a35ad",
          700: "#65268f",
          800: "#501a71",
          900: "#3b0e53",
        },
        gradient: {
          purple: "#8f46c1",
          pink: "#a0459b",
          magenta: "#bd4580",
          coral: "#d56f66",
        },
        bg: {
          DEFAULT: "#0c0612",
          light: "#1a1522",
        },
        txt: {
          DEFAULT: "#FFFFFF",
          secondary: "#B3B3B3",
          muted: "#8A8A9A",
        },
        accent: {
          blue: "#58ABFF",
          green: "#4DE6C8",
          yellow: "#FFC14D",
          pink: "#FF4DA6",
        },
        card: {
          purple: "#8f46c1",
          pink: "#a0459b",
          magenta: "#bd4580",
          coral: "#d56f66",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      boxShadow: {
        glow: "0 0 15px rgba(143, 70, 193, 0.5)",
        "glow-secondary": "0 0 15px rgba(213, 111, 102, 0.5)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 20px 40px -5px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "card-shine":
          "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)",
        "gradient-main": "linear-gradient(to right, #8f46c1, #d56f66)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
      },
    },
  },
  plugins: [],
};

export default config;
