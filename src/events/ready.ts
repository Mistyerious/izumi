import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

@ApplyOptions<EventOptions>({ once: true })
export default class extends Event<Events.Ready> {
	run() {
		this.context.logger.info(`${this.context.client.user?.tag} is now online and serving ${this.context.client.guilds.cache.reduce((accumulator: number, guild: Guild) => accumulator + guild.memberCount, 0)} users.`);
	}
}
