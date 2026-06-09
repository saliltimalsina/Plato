import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // HeroUI ships its theme as a nested dep of @heroui/react; the compiled
    // class strings live in .mjs chunks. Match both nested + hoisted layouts.
    "./node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,mjs}",
    "./node_modules/@heroui/theme/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Warm Operations palette (matches the original prototype)
        cream: "#FBF8F5",
        ink: "#11181C",
        warm: {
          50: "#FFFDFB",
          100: "#FBF6F1",
          200: "#F4EFEB",
          300: "#EFEAE6",
          400: "#E6E1DC",
          500: "#9A8C80",
          600: "#6B5F55",
          700: "#3F3933",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FBF8F5",
            foreground: "#11181C",
            primary: {
              50: "#FFF1EB",
              100: "#FDECE4",
              200: "#FBD9CB",
              300: "#F8C9B6",
              400: "#F58B63",
              500: "#F15022",
              600: "#D8420F",
              700: "#B0350C",
              foreground: "#FFFFFF",
              DEFAULT: "#F15022",
            },
            focus: "#F15022",
          },
          layout: {
            radius: { small: "8px", medium: "11px", large: "16px" },
          },
        },
      },
    }) as Config["plugins"] extends (infer P)[] ? P : never,
  ],
};

export default config;
