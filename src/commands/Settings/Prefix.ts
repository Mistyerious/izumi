import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { IzumiCommand } from '@client';

@ApplyOptions<IzumiCommand.Options>({
	name: 'prefix',
	userPermissions: ['MANAGE_GUILD'],
	subCommands: ['add', 'remove', { input: 'list', default: true }],
})
export default class extends IzumiCommand {
	async add({ embed, guild, author }: Message, args: Args) {
		const prefix = await args.pickResult('string', { minimum: 1, maximum: 10 });

		if (!prefix.success) return embed.error.setDescription(`Invalid prefix provided.\nBe sure that it's between 1 to 10 characters and that it's not an existing prefix.`).reply();

		this.context.client.settings.set(guild, 'prefixes', [...guild?.settings.prefixes!, prefix.value].removeDuplicates());
		return embed.success.setDescription(`Successfully added **\`${prefix.value}\`** to \`${guild?.name}\` prefixes.`).reply({ users: [author.id], roles: [] });
	}

	async remove({ guild, embed, author }: Message, args: Args) {
		const prefix = await args.pickResult('string', { minimum: 1, maximum: 10 });

		if (!prefix.success || !guild?.settings.prefixes.includes(prefix.value)) return embed.error.setDescription('Invalid prefix provided.').reply();

		this.context.client.settings.set(
			guild,
			'prefixes',
			guild?.settings.prefixes.filter((p) => p !== prefix.value),
		);

		return embed.success.setDescription(`Successfully removed **\`${prefix.value}\`** from \`${guild?.name}\` prefixes.`).reply({ users: [author.id], roles: [] });
	}

	list({ embed, guild }: Message) {
		embed
			.setTitle(`Here's the prefixes available for ${guild?.name}`)
			.setThumbnail(guild?.iconURL({ dynamic: true })!)
			.setDescription(guild?.settings.prefixes.map((prefix) => `- **\`${prefix}\`**`).join('\n')!)
			.reply();
	}
}
