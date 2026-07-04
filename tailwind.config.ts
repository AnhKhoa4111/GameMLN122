import type { Config } from 'tailwindcss'

const config: Config = {
    content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./lib/**/*.{js,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'vn-red': '#dc2626',
                'vn-yellow': '#facc15',
            },
        },
    },
    plugins: [],
}

export default config
