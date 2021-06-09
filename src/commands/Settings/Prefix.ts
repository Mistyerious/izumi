import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { IzumiCommand } from '@client';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: 'prefix',
	subCommands: ['add', 'remove', { input: 'list', default: true }],
})
export default class extends IzumiCommand {
	async add(message: Message, args: Args) {
		const prefix = await args.pickResult('string', { minimum: 1, maximum: 10 });

		if (!prefix.success) return message.embed.error.setDescription(`Invalid prefix provided.\nBe sure that it's between 1 to 10 characters and that it's not an existing prefix.`).reply();

		this.context.client.settings.set(message.guild, 'prefixes', [...message.guild?.settings.prefixes!, prefix.value].removeDuplicates());
		return message.embed.success.setDescription(`Successfully added **\`${prefix.value}\`** to \`${message.guild?.name}\` prefixes.`).reply({ users: [message.author.id], roles: [] });
	}

	async remove(message: Message, args: Args) {
		const prefix = await args.pickResult('string', { minimum: 1, maximum: 10 });
		
		if (!prefix.success || !message.guild?.settings.prefixes.includes(prefix.value)) return message.embed.error.setDescription('Invalid prefix provided.').reply();

		this.context.client.settings.set(
			message.guild,
			'prefixes',
			message.guild?.settings.prefixes.filter((p) => p !== prefix.value),
		);

		return message.embed.success.setDescription(`Successfully removed **\`${prefix.value}\`** from \`${message.guild?.name}\` prefixes.`).reply({ users: [message.author.id], roles: [] });
	}

	list(message: Message) {
		message.embed
			.setTitle(`Here's the prefixes avaiable for ${message.guild?.name}`)
			.setThumbnail(message.guild?.iconURL({ dynamic: true })!)
			.setDescription(message.guild?.settings.prefixes.map((prefix) => `- **\`${prefix}\`**`).join('\n')!)
			.reply();
	}
}
