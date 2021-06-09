import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, } from '@sapphire/framework';
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
			?.then(async (m: Message) => {
				m.embed.setDescription([`**↩️ RTT**: \`${((m.editedAt || m.createdAt) as any) - ((editedAt || createdAt) as any)}\`ms`, `**💟 Heartbeat**: \`${Math.round(client.ws.ping)}\`ms`].join('\n')).edit();
			});
	}
}
