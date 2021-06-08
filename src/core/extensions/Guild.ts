import { IzumiClient, IGuildSettings } from '@core';
import { Structures } from 'discord.js';

export class IzumiGuild extends Structures.get('Guild') {
	readonly settings: IGuildSettings = (this.client as IzumiClient).settings.raw(this.id);
}

Structures.extend('Guild', () => IzumiGuild);

declare module 'discord.js' {
	interface Guild {
		readonly settings: IGuildSettings;
	}
}
