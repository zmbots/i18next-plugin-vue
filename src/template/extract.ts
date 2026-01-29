import type { VuePluginOptions } from '../types';

export function extractTemplateKeys(template: string, options: VuePluginOptions): string {
	if (!template) {
		return '';
	}

	const lines: string[] = [];
	const i18nAttr = options.attr;
	const bindEnabled = options.vueBindAttr;

	const attrRegex = new RegExp(`([a-zA-Z0-9_-]+)=(["'])(.*?)\\2`, 'g');

	let pos = 0;
	while (pos < template.length) {
		const tagOpen = template.indexOf('<', pos);
		if (tagOpen === -1) break;

		const tagContentStart = tagOpen + 1;
		const tagClose = template.indexOf('>', tagContentStart);
		if (tagClose === -1) break;

		const tagContent = template.slice(tagContentStart, tagClose);
		const isClosingTag = tagContent.trim().startsWith('/');

		if (!isClosingTag) {
			const tagNameMatch = tagContent.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
			const tagName = tagNameMatch ? tagNameMatch[1] : '';

			if (tagName && tagName !== 'template' && tagName !== 'script') {
				let attrMatch;
				while ((attrMatch = attrRegex.exec(tagContent)) !== null) {
					const name = attrMatch[1];
					const value = attrMatch[3];

					if (name === i18nAttr && value) {
						const keys = value
							.split(';')
							.map((k) => k.trim())
							.filter(Boolean);
						for (const key of keys) {
							lines.push(`t('${key}')`);
						}
					}

					if (bindEnabled) {
						if (name.startsWith('v-bind:') || name.startsWith(':') || name.startsWith('v-on:') || name.startsWith('@')) {
							if (isTranslationExpression(value, options.functions || [])) {
								lines.push(value);
							}
						}
					}
				}
			}
		}

		pos = tagClose + 1;
	}

	return lines.join('\n');
}

function isTranslationExpression(expr: string, functions: string[]): boolean {
	const trimmed = expr.trim();
	for (const func of functions) {
		if (trimmed.startsWith(`${func}(`)) {
			return true;
		}
	}
	return false;
}
