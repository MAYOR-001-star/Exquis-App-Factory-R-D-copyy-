import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: './',
	build: {
		sourcemap: true,
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks: (moduleId) => {
					if (moduleId.includes('node_modules')) {
						const parts = moduleId.toString().split('node_modules/')[1].split('/');
						const pkgName = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
						return `vendor-${pkgName}`;
					}
				},
			}
		}
	},
	server: {
		strictPort: true,
	},
});