import { EmbedMessageTypes } from '@typings';
import { Message, MessageEmbed } from 'discord.js';

export class IzumiEmbed extends MessageEmbed {
	private static readonly _footers = ['Remember to drink water', 'I ran out of ideas lol.'];

	constructor(private readonly _message?: Message) {
		super({
			color: 0x89cff0,
			timestamp: new Date(),
			footer: { iconURL: undefined, text: IzumiEmbed._footers.random() },
		});
	}

	send(options: EmbedMessageTypes = {}): Promise<Message | Message[]> | undefined {
		return this._message?.channel.send({ embed: this, ...options });
	}

	reply(options: EmbedMessageTypes = {}): Promise<Message | Message[]> | undefined {
		return this._message?.reply({ embed: this, ...options });
	}

	edit(options: EmbedMessageTypes = {}): Promise<Message> | undefined {
		return this._message?.edit({ embed: this, ...options });
	}

	get fatal(): this {
		return this.setColor(0xef7c8e).setTitle('A fatal error occured.').setFooter('Consider reporting this to the developer in the support server!');
	}

	get error(): this {
		return this.setColor(0xef7c8e).setTitle('An error occured.');
	}

	get success(): this {
		return this.setColor(0xb6e2d3).setTitle('Success');
	}
}
