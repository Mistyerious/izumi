import { Args, Awaited, CommandContext } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Message } from 'discord.js';

export abstract class IzumiCommand extends SubCommandPluginCommand {
	run(message: Message, args: Args, context: CommandContext): Awaited<unknown> {
		if (!this.subCommands) throw new Error(`Command ${this.name} does not implement the run method nor does it support sub-commands.`);

		return this.subCommands.run({ message, args, context, command: this });
	}
}
