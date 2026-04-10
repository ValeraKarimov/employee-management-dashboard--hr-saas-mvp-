import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/constants/**/*.{js,ts}',
    './app/utils/**/*.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config