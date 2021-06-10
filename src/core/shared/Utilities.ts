export class Utilities {
	static rgb = ([r, g, b]: [number, number, number], ...args: unknown[]): string => `\x1b[38;2;${r};${g};${b}m${args.join(' ')}\x1b[0m`;

	static pages<T>(arr: T[], itemsPerPage: number, page = 1): T[] | undefined {
		const maxPages: number = Math.ceil(arr.length / itemsPerPage);
		if (page < 1 || page > maxPages) return;
		return arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
	}
}
