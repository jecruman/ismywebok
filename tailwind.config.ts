import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: { green: '#2ECC71', dark: '#2E2E2E' } } } },
  plugins: [],
} satisfies Config;
