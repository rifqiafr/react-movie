import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti '<REPO-NAME>' dengan nama repository Anda, contoh: '/my-react-watchlist/'
const BASE_PATH = '/react-movie/'; 

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH, // Menentukan base path untuk build
})