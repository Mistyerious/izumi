import type { ClientOptions, Message } from 'discord.js';

import { GuildProvider } from '@database';
import { API } from '@api';
import { enumerable } from '@sapphire/decorators';
import { SapphireClient } from '@sapphire/framework';

declare module '@sapphire/framework' {
	interface SapphireClient {
		settings: GuildProvider;
	}
}

export class IzumiClient extends SapphireClient {
	@enumerable(false)
	readonly settings = new GuildProvider();

	constructor(options: ClientOptions) {
		super(options);
	}

	fetchPrefix = (message: Message) => message.guild?.settings.prefixes!;

	async start(token: string, port: number) {
		new API().start(port);

		await super.login(token);
		await this.settings.init();

		prisma.$connect().then(() => {
			this.logger.info('Connected to PostgreSQL');
		});
	}
}
