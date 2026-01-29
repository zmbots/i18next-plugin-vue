import { parse } from '@vue/compiler-sfc';
import type { VueSFCParser, VuePluginOptions, VueSFCPart } from '../types';
import { extractTemplateKeys } from '../template/extract';

interface SFCDescriptor {
	template: { content: string } | null;
	script: { content: string } | null;
	scriptSetup: { content: string } | null;
	styles: Array<{ content: string }>;
	customBlocks: Array<{ type: string; content: string }>;
}

export function createVue3Parser(code: string, options: VuePluginOptions): VueSFCParser {
	const descriptor = parse(code) as unknown as SFCDescriptor;

	return {
		extractScript(): string {
			const scriptParts: string[] = [];

			if (descriptor.script?.content) {
				scriptParts.push(descriptor.script.content);
			}

			if (descriptor.scriptSetup?.content) {
				scriptParts.push(descriptor.scriptSetup.content);
			}

			return scriptParts.join('\n');
		},

		extractTemplate(): string {
			return descriptor.template?.content || '';
		},

		extractStyles(): string[] {
			return descriptor.styles.map((style) => style.content);
		},

		extractCustomBlocks(): VueSFCPart[] {
			return descriptor.customBlocks.map((block) => ({
				type: block.type as VueSFCPart['type'],
				content: block.content,
			}));
		},

		generateVirtualJS(): string {
			const template = descriptor.template?.content || '';
			return extractTemplateKeys(template, options);
		},
	};
}
