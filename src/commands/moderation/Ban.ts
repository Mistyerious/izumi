import { ApplyOptions } from '@sapphire/decorators';
import { Args, CommandOptions } from '@sapphire/framework';
import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';
import { MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ban',
})
export default class Ban extends IzumiCommand {
	async run(msg: Message, args: Args) {
		const member = await args.pickResult('member');
		const reason = (await args.restResult('string')).value ?? 'No reason provided';

		if (!member.success) return msg.embed.error.setDescription('Please provide a valid member').send();

		const row = new MessageActionRow().addComponents(new MessageButton().setCustomID('banApprove').setLabel('Approve').setStyle('SUCCESS'), new MessageButton().setCustomID('banDeny').setLabel('Deny').setStyle('DANGER'));

		let buttonEmbed = msg.embed.success
			.setDescription(`Are you sure you want to kick ${member.value.user.username}?`)
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setFooter(`You have 30 seconds to decide`);

		const message = await msg.channel.send({ embed: buttonEmbed, components: [row] });

		const filter = (interaction: MessageComponentInteraction) => ['banApprove', 'banDeny'].includes(interaction.customID) && interaction.user.id === msg.author.id;

		const collector = message.createMessageComponentInteractionCollector(filter, { time: 30000 });

		collector.on('collect', async (interaction) => {
			switch (interaction.customID) {
				case 'banApprove':
					await member.value.send(msg.embed.success.setDescription(`You have been banned from \`${msg.guild?.name}\` (\`${msg.guild?.id}\`) for **${reason}**`)).catch((e) => console.log(e));
					let success = msg.embed.success.setDescription(`\`${member.value.user.tag}\` (\`${member.value.id}\`) has been banned for **${reason}**`);
					await interaction.update({ embeds: [success], components: [] });
					await member.value.ban({ reason });
					collector.stop();
					break;
				case 'banDeny':
					let embed = msg.embed.error.setDescription(`Command has been canceled due to denying`).setAuthor(this.context.client.user?.username!, this.context.client.user?.displayAvatarURL());
					await interaction.update({ embeds: [embed], components: [] });
					return collector.stop();
			}
		});

		collector.on('end', (_, reason) => {
			let embed = msg.embed.error.setDescription('You ran out of time, please try again.');
			if (reason === 'time') message.edit({ embed: embed, components: [] });
			return;
		});
	}
}
