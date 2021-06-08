import type { IzumiClient, IGuildSettings } from '@core';
import { Client, Structures } from 'discord.js';

export class IzumiGuild extends Structures.get('Guild') {
	get settings(): IGuildSettings {
		return (this.client as IzumiClient).settings.raw(this.id);
	}
}

Structures.extend('Guild', () => IzumiGuild);

declare module 'discord.js' {
	interface Guild {
		settings: IGuildSettings;
	}
}
