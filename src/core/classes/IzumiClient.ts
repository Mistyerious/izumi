import { GuildProvider } from '@database';
import { enumerable } from '@sapphire/decorators';
import { SapphireClient, SapphirePrefixHook } from '@sapphire/framework';
import { ClientOptions, Message, MessageEmbed } from 'discord.js';

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

	fetchPrefix = (message: Message) => {
		return message.guild?.settings.prefixes!;
	};

	async start(token: string) {
		await super.login(token);
		await this.settings.init();

		prisma.$connect().then(() => {
			this.logger.info('Connected to PostgreSQL');
		});
	}
}
