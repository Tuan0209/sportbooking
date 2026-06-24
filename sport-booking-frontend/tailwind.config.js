/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#06231A',        // xanh rừng gần đen — nền sân vận động, tiêu đề
        'ink-soft': '#0C3326', // ink nhạt hơn cho panel tối
        pitch: '#0E8C4E',      // xanh cỏ chủ đạo
        'pitch-deep': '#0A6B3B', // hover / active
        'pitch-soft': '#E8F5EC', // nền badge / vùng xanh nhạt
        lime: '#BEF264',       // xanh đèn pha — accent điểm xuyết
        'lime-deep': '#A6E635',
        chalk: '#F5F7F4',      // nền app (trắng ngả cỏ)
        line: '#E4EAE3',       // viền mảnh
        amber: {               // sao đánh giá / cảnh báo (giữ đủ thang màu + DEFAULT)
          DEFAULT: '#F59E0B',
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
          400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
          800: '#92400E', 900: '#78350F',
        },
        muted: '#5B6B61',      // chữ phụ
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(6,35,26,0.04), 0 8px 24px -12px rgba(6,35,26,0.12)',
        'card-hover': '0 12px 40px -12px rgba(6,35,26,0.22)',
        glow: '0 10px 30px -8px rgba(14,140,78,0.45)',
        'glow-lime': '0 8px 26px -6px rgba(166,230,53,0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
