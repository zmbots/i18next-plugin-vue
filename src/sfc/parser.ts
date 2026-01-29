import type { VuePluginOptions, VueSFCParser } from '../types';
import { createVue2Parser } from './vue2';
import { createVue3Parser } from './vue3';

export function createParser(vueVersion: 2 | 3, code: string, options: VuePluginOptions): VueSFCParser {
	if (vueVersion === 2) {
		return createVue2Parser(code, options);
	}
	return createVue3Parser(code, options);
}

export function detectVueVersion(code: string): 2 | 3 {
	if (code.includes('<script setup')) {
		return 3;
	}

	if (code.includes('defineComponent')) {
		return 3;
	}

	const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
	if (scriptMatch) {
		const scriptContent = scriptMatch[1];
		if (scriptContent.includes('data()')) {
			return 2;
		}
		if (scriptContent.includes('export default')) {
			return scriptContent.includes('setup(') ? 3 : 2;
		}
	}

	return 3;
}
