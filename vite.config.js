import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue(), vueJsx()],
    server: {
        host: '0.0.0.0',
        port: 8080,
        watch: {
            usePolling: true,
        },
    },
    resolve: {
        alias: {
            '@game': fileURLToPath(new URL('./src/components/game', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
            '@scss': fileURLToPath(new URL('./src/scss', import.meta.url)),
            '@ui': fileURLToPath(new URL('./src/components/UI', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
