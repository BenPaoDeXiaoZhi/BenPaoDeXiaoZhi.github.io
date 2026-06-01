import adapter from '@sveltejs/adapter-auto';
import type { Config } from '@sveltejs/kit';

const config: Config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
