import { ApplyOptions } from '@sapphire/decorators';
import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';

@ApplyOptions<IzumiCommand.Options>({
	name: 'ping',
	description: 'Shows you the ping of the bot duh',
})
export default class extends IzumiCommand {
	run({ embed, createdTimestamp, editedTimestamp, client }: Message) {
		embed
			.setDescription('Pong!')
			.reply()
			?.then(async (message) => {
				if (Array.isArray(message)) message = message[0];
				message.embed
					.setDescription([`**↩️ RTT**: \`${(message.createdTimestamp || message.editedTimestamp)! - ((editedTimestamp || createdTimestamp) as any)}\`ms`, `**💟 Heartbeat**: \`${Math.round(client.ws.ping)}\`ms`].join('\n'))
					.edit();
			});
	}
}
