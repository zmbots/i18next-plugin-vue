export function isVueFile(path: string, patterns: string[]): boolean {
	return patterns.some((pattern) => {
		if (pattern.startsWith('.')) {
			return path.endsWith(pattern);
		}
		return path.includes(pattern);
	});
}

export function extractStringValue(str: string): string | null {
	const match = str.match(/^['"]([^'"]*)['"]/);
	return match ? match[1] : null;
}

export function parseJSONOptions(str: string): Record<string, unknown> | null {
	try {
		return JSON.parse(str);
	} catch {
		return null;
	}
}

export function splitKeys(keysStr: string): string[] {
	return keysStr
		.split(';')
		.map((k) => k.trim())
		.filter(Boolean);
}
