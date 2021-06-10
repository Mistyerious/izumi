import { ApplyOptions } from '@sapphire/decorators';
import { IzumiCommand, IzumiEmbed } from '@client';
import type { Message } from 'discord.js';
import { Args, CommandStore, Store } from '@sapphire/framework';
import { Collection } from 'discord.js';

@ApplyOptions<IzumiCommand.Options>({
	name: 'help',
	aliases: ['commands'],
})
export default class extends IzumiCommand {
	run({ embed }: Message, args: Args) {
		const helpEmbed = embed.setTitle('Commands').setThumbnail(this.context.client.user?.displayAvatarURL({ dynamic: true })!);

		for (const [category, commands] of this._getAllCommands()) helpEmbed.addField(category, commands.map((command) => `\`${command.name}\``).join(', '));
		helpEmbed.reply();
	}

	private _getAllCommands() {
		const storeCommands = Store.injectedContext.stores.get('commands');
		const commands = new Collection<string, IzumiCommand[]>();

		for (const command of storeCommands.values() as IterableIterator<IzumiCommand>) {
			const category = commands.get(command.category);

			if (category) category.push(command);
			else commands.set(command.category, [command]);
		}

		return commands;
	}
}
