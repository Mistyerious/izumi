import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions } from '@sapphire/framework';
import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
})
export default class extends IzumiCommand {
	run({ embed, editedAt, createdAt, client }: Message) {
		embed
			.setDescription('Pong!')
			.reply()
			?.then(async (message) => {
				if (Array.isArray(message)) message = message[0];
				message.embed.setDescription([`**↩️ RTT**: \`${((message.editedAt || message.createdAt) as any) - ((editedAt || createdAt) as any)}\`ms`, `**💟 Heartbeat**: \`${Math.round(client.ws.ping)}\`ms`].join('\n')).edit();
			});
	}
}
