import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E8E6E',
          hover: '#166F57',
          soft: '#E6F4EF',
        },
        background: '#F5F8F7',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#14231F',
          muted: '#6B7C77',
        },
        border: '#E3EAE7',
        priority: {
          high: {
            DEFAULT: '#E8731A',
            soft: '#FDEBD8',
          },
          medium: {
            DEFAULT: '#B88A0B',
            soft: '#FBF1D3',
          },
          low: {
            DEFAULT: '#2E9E6B',
            soft: '#E3F5EC',
          },
        },
        status: {
          inprogress: {
            DEFAULT: '#2F7DD1',
            soft: '#E3EEFA',
          },
          resolved: {
            DEFAULT: '#2E9E6B',
            soft: '#E3F5EC',
          },
          onhold: {
            DEFAULT: '#D64545',
            soft: '#FBE6E6',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'urdu-body': ['"Noto Nastaliq Urdu"', 'serif'],
        'urdu-ui': ['"Noto Naskh Arabic"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(20, 35, 31, 0.04), 0 1px 2px -1px rgba(20, 35, 31, 0.04)',
        card: '0 2px 6px 0 rgba(20, 35, 31, 0.05), 0 1px 3px -1px rgba(20, 35, 31, 0.03)',
        floating: '0 10px 25px -3px rgba(20, 35, 31, 0.08), 0 4px 10px -4px rgba(20, 35, 31, 0.04)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
