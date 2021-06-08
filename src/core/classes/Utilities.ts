import { Constructable } from 'discord.js';

export class Utilities {
	/**
	 * Return the RGB ANSI escape code.
	 * @param param0 RGB Colour
	 * @param args The text to colour
	 * @returns string
	 */
	static rgb = ([r, g, b]: [number, number, number], ...args: unknown[]): string => `\x1b[38;2;${r};${g};${b}m${args.join(' ')}\x1b[0m`;

	static createClassDecorator = <T extends (...args: any[]) => void>(fun: T): ClassDecorator => fun;
}
