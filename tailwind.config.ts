import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				// Mobile-specific animations
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'slide-in-from-top': {
					from: {
						transform: 'translateY(-100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'slide-in-from-bottom': {
					from: {
						transform: 'translateY(100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'slide-in-from-left': {
					from: {
						transform: 'translateX(-100%)'
					},
					to: {
						transform: 'translateX(0)'
					}
				},
				'slide-in-from-right': {
					from: {
						transform: 'translateX(100%)'
					},
					to: {
						transform: 'translateX(0)'
					}
				},
				'zoom-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'zoom-out': {
					from: {
						opacity: '0',
						transform: 'scale(1.05)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'bounce-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.3)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'slide-down': {
					from: {
						transform: 'translateY(-100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'rotate-in': {
					from: {
						opacity: '0',
						transform: 'rotate(-180deg) scale(0.3)'
					},
					to: {
						opacity: '1',
						transform: 'rotate(0deg) scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Mobile-specific animations
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
				'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
				'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
				'zoom-in': 'zoom-in 0.2s ease-out',
				'zoom-out': 'zoom-out 0.2s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'rotate-in': 'rotate-in 0.5s ease-out'
			},
			// Mobile-specific spacing
			spacing: {
				'safe-top': 'env(safe-area-inset-top, 0px)',
				'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
				'safe-left': 'env(safe-area-inset-left, 0px)',
				'safe-right': 'env(safe-area-inset-right, 0px)',
			},
			// Mobile-specific z-index
			zIndex: {
				'dropdown': '50',
				'modal': '100',
				'tooltip': '150',
			},
			// Mobile-specific aspect ratios
			aspectRatio: {
				'photo': '4/3',
				'video': '16/9',
				'square': '1/1',
			},
			// Mobile-specific backdrop blur
			backdropBlur: {
				'xs': '2px',
			},
			// Mobile-specific touch action
			touchAction: {
				'manipulation': 'manipulation',
				'pan-x': 'pan-x',
				'pan-left': 'pan-left',
				'pan-right': 'pan-right',
				'pan-y': 'pan-y',
				'pan-up': 'pan-up',
				'pan-down': 'pan-down',
				'pinch-zoom': 'pinch-zoom',
				'auto': 'auto',
				'none': 'none',
			},
			// Mobile-specific user select
			userSelect: {
				'none': 'none',
				'text': 'text',
				'all': 'all',
				'auto': 'auto',
			},
			// Mobile-specific scroll behavior
			scrollBehavior: {
				'auto': 'auto',
				'smooth': 'smooth',
			},
			// Mobile-specific overscroll behavior
			overscrollBehavior: {
				'auto': 'auto',
				'contain': 'contain',
				'none': 'none',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
