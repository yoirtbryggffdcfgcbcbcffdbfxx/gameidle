import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    // @ts-expect-error - Conflit de types entre Vite 6.2 et Vitest 1.6 (cosmétique, les tests fonctionnent)
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/data.ts', // Fichiers de données statiques
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './v2'),
        },
    },
});
