import { enumerable } from '@sapphire/decorators';
import { ILogger } from '@sapphire/framework';
import { EOL } from 'os';
import { Utilities } from './Utilities';

type RGBColour = [number, number, number];

export class IzumiLogger implements ILogger {
	constructor(private readonly _namespace: string) {}

	@enumerable(false)
	private readonly _colours: {
		info: RGBColour;
		debug: RGBColour;
		error: RGBColour;
		warn: RGBColour;
		foreground: RGBColour;
	} = {
		info: [143, 188, 187],
		debug: [161, 188, 138],
		error: [191, 97, 106],
		warn: [235, 203, 139],
		foreground: [139, 132, 121],
	};

	trace(...message: unknown[]) {
		this._write(this._colours.info, 'trace', message);
	}

	info(...message: unknown[]) {
		this._write(this._colours.info, 'info', message);
	}

	debug(...message: unknown[]) {
		this._write(this._colours.debug, 'debug', message);
	}

	warn(...message: unknown[]) {
		this._write(this._colours.warn, 'warn', message);
	}

	error(...message: unknown[]) {
		this._write(this._colours.error, 'error', message);
	}

	fatal(...message: unknown[]) {
		this._write(this._colours.error, 'fatal', message);
	}

	write(...message: unknown[]) {
		this._write(this._colours.info, 'write', message);
	}

	protected _write(colour: [number, number, number], level: string, ...message: unknown[]) {
		process.stdout.write(
			`${Utilities.rgb(this._colours.foreground, new Date().toLocaleString())} ${Utilities.rgb(colour, level.toUpperCase())} (${this._namespace.toDotCase()}) ${Utilities.rgb(this._colours.foreground, process.pid)} ${Utilities.rgb(
				colour,
				message,
			)}${EOL}`,
		);
	}
}
