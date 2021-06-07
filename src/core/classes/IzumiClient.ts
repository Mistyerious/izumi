import type { Configuration } from '@sach1/dahlia';
import { SapphireClient } from '@sapphire/framework';
import { ClientOptions, Intents } from 'discord.js';

declare module '@sapphire/framework' {
	interface SapphireClient {
		config: Configuration;
	}
}

export class IzumiClient extends SapphireClient {
	readonly config;

	constructor(options: ClientOptions = { ws: { intents: Intents.ALL } }, config: Configuration) {
		super(options);

		this.config = config;
	}

	async start(token: string) {
		this.logger.info('Logging in...');
		
		super.login(token).then(() => {
			this.logger.info('Logged in.');
		});
	}
}
