import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

@ApplyOptions<EventOptions>({ once: true, event: Events.Ready })
export default class extends Event<Events.Ready> {
	private readonly _statuses = config.get<Array<string>>('bot.statuses', [])!;

	run() {
		this.context.logger.info(`${this.context.client.user?.tag} is now online and serving ${this.context.client.guilds.cache.reduce((accumulator: number, guild: Guild) => accumulator + guild.memberCount, 0)} users.`);

		this._setStatus();
		setTimeout(this._setStatus, 6e4);
	}

	private _setStatus = () => {
		this.context.client.user?.setPresence({
			status: 'invisible',
			activities: [
				{
					name: this._statuses.progress(),
					type: 'WATCHING',
				},
			],
		});
	};
}
