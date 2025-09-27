import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
				inter: ['Inter', 'system-ui', 'sans-serif'],
				DEFAULT: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					foreground: 'hsl(var(--brand-foreground))'
				},
				mint: {
					DEFAULT: 'hsl(var(--mint))',
					foreground: 'hsl(var(--mint-foreground))'
				},
				frog: {
					DEFAULT: 'hsl(var(--frog))',
					foreground: 'hsl(var(--frog-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				income: {
					DEFAULT: 'hsl(var(--income))',
					foreground: 'hsl(var(--income-foreground))'
				},
				expense: {
					DEFAULT: 'hsl(var(--expense))',
					foreground: 'hsl(var(--expense-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Linear-inspired color palette
				gray: {
					50: 'var(--color-gray-50)',
					100: 'var(--color-gray-100)',
					200: 'var(--color-gray-200)',
					300: 'var(--color-gray-300)',
					400: 'var(--color-gray-400)',
					500: 'var(--color-gray-500)',
					600: 'var(--color-gray-600)',
					700: 'var(--color-gray-700)',
					800: 'var(--color-gray-800)',
					900: 'var(--color-gray-900)',
					950: 'var(--color-gray-950)',
				},
				purple: {
					50: 'var(--color-purple-50)',
					100: 'var(--color-purple-100)',
					200: 'var(--color-purple-200)',
					300: 'var(--color-purple-300)',
					400: 'var(--color-purple-400)',
					500: 'var(--color-purple-500)',
					600: 'var(--color-purple-600)',
					700: 'var(--color-purple-700)',
					800: 'var(--color-purple-800)',
					900: 'var(--color-purple-900)',
					950: 'var(--color-purple-950)',
				},
				teal: 'var(--color-teal)',
				coral: 'var(--color-coral)',
				'red-accent': 'var(--color-red-accent)',
				olive: 'var(--color-olive)',
				'yellow-accent': 'var(--color-yellow-accent)',
				'orange-accent': 'var(--color-orange-accent)',
				'light-purple': 'var(--color-light-purple)',
				'light-blue': 'var(--color-light-blue)',
				'light-gray-blue': 'var(--color-light-gray-blue)',
				'mint-accent': 'var(--color-mint)',
				// Secondary Colors
				'secondary-1': 'var(--color-secondary-1)',
				'secondary-2': 'var(--color-secondary-2)',
				'secondary-3': 'var(--color-secondary-3)',
				'secondary-4': 'var(--color-secondary-4)',
				'secondary-5': 'var(--color-secondary-5)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'none': 'var(--shadow-none)',
				'tiny': 'var(--shadow-tiny)',
				'low': 'var(--shadow-low)',
				'medium': 'var(--shadow-medium)',
				'high': 'var(--shadow-high)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'inner': 'var(--shadow-inner)',
				'glow': 'var(--shadow-glow)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
