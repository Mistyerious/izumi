import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { IzumiCommand } from '@client';
import { MessageActionRow, MessageButton, MessageComponentInteraction, Message } from 'discord.js';

@ApplyOptions<IzumiCommand.Options>({
	name: 'kick',
	userPermissions: ['KICK_MEMBERS'],
	permissions: ['KICK_MEMBERS'],
})
export default class extends IzumiCommand {
	async run(message: Message, args: Args) {
		this.preconditions.run(message, this);

		const member = await args.pickResult('member');
		const reason = (await args.restResult('string')).value ?? 'No reason provided';

		if (!member.success) return message.embed.error.setDescription('Please provide a valid member').reply();
		if ([member.value.id, this.context.client.id].includes(message.member?.id!)) return message.embed.error.setDescription('Why would you want to kick that user?').reply();
		if (message.member?.roles.highest.position! < member.value.roles.highest.position) return message.embed.error.setDescription('That user highest role is higher than yours.').reply();

		message.embed.success
			.setDescription(`Are you sure you want to kick ${member.value.user.username}?`)
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setFooter(`You have 30 seconds to decide`)
			.reply({ components: [new MessageActionRow().addComponents(new MessageButton().setCustomID('kickApprove').setLabel('Approve').setStyle('SUCCESS'), new MessageButton().setCustomID('kickDeny').setLabel('Deny').setStyle('DANGER'))] })
			?.then((msg: Message | Message[]) => {
				if (Array.isArray(msg)) msg = msg[0];

				msg
					.awaitMessageComponentInteraction((interaction: MessageComponentInteraction) => ['kickApprove', 'kickDeny'].includes(interaction.customID) && interaction.user.id === message.author.id, 3e4)
					.then(async (interaction: MessageComponentInteraction) => {
						switch (interaction.customID) {
							case 'kickApprove':
								try {
									await member.value.send({ embed: message.embed.success.setDescription(`You have been kicked from \`${message.guild?.name}\` (\`${message.guild?.id}\`) for **${reason}**`) });
								} catch (_e) {
									// Means user has DMs disabled, no need to give two fucks
								}

								await interaction.update({ embeds: [message.embed.success.setDescription(`\`${member.value.user.tag}\` (\`${member.value.id}\`) has been kicked for **${reason}**`)], components: [] });

								if (member.value.kickable) await member.value.kick(reason);
								else message.embed.error.setDescription('Apparently that user is not kickable :shrug:').edit();
								break;
							case 'kickDeny':
								await interaction.update({
									embeds: [message.embed.error.setDescription(`Command has been canceled due to denying`).setAuthor(this.context.client.user?.username!, this.context.client.user?.displayAvatarURL())],
									components: [],
								});
								break;
						}
					})
					.catch((_e) => message.embed.error.setDescription('You ran out of time, please try again.').edit());
			});
	}
}
