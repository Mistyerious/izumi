import { GuildProvider } from '@database';
import type { Configuration } from '@sach1/dahlia';

import { enumerable } from '@sapphire/decorators';
import { SapphireClient } from '@sapphire/framework';
import { ClientOptions, Intents } from 'discord.js';

declare module '@sapphire/framework' {
	interface SapphireClient {
		config: Configuration;
		settings: GuildProvider;
	}
}

export class IzumiClient extends SapphireClient {
	@enumerable(false)
	readonly config;

	@enumerable(false)
	readonly settings = new GuildProvider();

	constructor(options: ClientOptions = { ws: { intents: Intents.ALL } }, config: Configuration) {
		super(options);

		this.config = config;
	}

	async start(token: string) {
		await super.login(token);

		await this.settings.init();

		prisma.$connect().then(() => {
			this.logger.info('Connected to PostgreSQL');
		});
	}
}
