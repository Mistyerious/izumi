import { IGuildSettings, IzumiEmbed } from '@core';
import { Structures } from 'discord.js';

export class IzumiMessage extends Structures.get('Message') {
	get embed(): IzumiEmbed {
		return new IzumiEmbed(this);
	}
}

Structures.extend('Message', () => IzumiMessage);

declare module 'discord.js' {
	interface Message {
		embed: IzumiEmbed;
	}
}
