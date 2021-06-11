import { ApplyOptions } from '@sapphire/decorators';
import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';
import { Args, Command, Store } from '@sapphire/framework';
import { Collection } from 'discord.js';

@ApplyOptions<IzumiCommand.Options>({
	name: 'help',
	aliases: ['commands'],
	description: 'Shows you all the commands and even provides help on a specific command',
	usage: 'help [command]',
	examples: [
		'help ban',
		'help ping'
	]
})
export default class extends IzumiCommand {
	async run({ embed }: Message, args: Args) {
		const command = await args.pickResult('string')

		if(command.success){
			const cmd = Store.injectedContext.stores.get('commands').find((cmd: Command) => cmd.name === command.value) as IzumiCommand

			if(!cmd) return embed.error.setDescription('We could not find the command you are looking for, please revise your search term.').send()
			const commandEmbed = embed.setTitle(`${cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)} | Help`).setThumbnail(this.context.client.user?.displayAvatarURL()!).addField(`**Description:**`, `**\`${cmd.description}\`**`, false)

			if(cmd.options.usage) commandEmbed.addField(`**Usage:**`, `**\`${cmd.options.usage}\`**`)
			if(cmd.options.examples) commandEmbed.addField(`**Examples:**`, `\`\`\`${cmd.options.examples.join('\n')}\`\`\``)
			return commandEmbed.reply()
		}
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
