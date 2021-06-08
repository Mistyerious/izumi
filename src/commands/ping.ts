import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, Args } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
})
export default class extends Command {
	async run(message: Message, _args: Args) {
		message.reply('Hello!');
	}
}
