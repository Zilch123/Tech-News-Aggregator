import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Ensure it matches the expected port
        proxy: {
            '/fetch_articles': 'http://localhost:8000' // Proxy API requests to the backend
        }
    }
});
