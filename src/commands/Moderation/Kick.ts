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
	async run({ guild, member, author, embed }: Message, args: Args) {
		const memberArg = await args.pickResult('member');
		const reason = (await args.restResult('string')).value ?? 'No reason provided';

		if (!memberArg.success) return embed.error.setDescription('Please provide a valid member').reply();
		if ([memberArg.value.id, this.context.client.id].includes(member?.id!)) return embed.error.setDescription('Why would you want to kick that user?').reply();
		if (member?.roles.highest.position! < memberArg.value.roles.highest.position) return embed.error.setDescription('That user highest role is higher than yours.').reply();

		embed.success
			.setDescription(`Are you sure you want to kick ${memberArg.value.user.username}?`)
			.setAuthor(author.username, author.displayAvatarURL({ dynamic: true }))
			.setFooter(`You have 30 seconds to decide`)
			.reply({ components: [new MessageActionRow().addComponents(new MessageButton().setCustomID('kickApprove').setLabel('Approve').setStyle('SUCCESS'), new MessageButton().setCustomID('kickDeny').setLabel('Deny').setStyle('DANGER'))] })
			?.then((msg: Message | Message[]) => {
				if (Array.isArray(msg)) msg = msg[0];

				msg
					.awaitMessageComponentInteraction((interaction: MessageComponentInteraction) => ['kickApprove', 'kickDeny'].includes(interaction.customID) && interaction.user.id === author.id, 3e4)
					.then(async (interaction: MessageComponentInteraction) => {
						switch (interaction.customID) {
							case 'kickApprove':
								try {
									await memberArg.value.send({ embed: embed.success.setDescription(`You have been kicked from \`${guild?.name}\` (\`${guild?.id}\`) for **${reason}**`) });
								} catch (_e) {
									// Means user has DMs disabled, no need to give two fucks
								}

								await interaction.update({ embeds: [embed.success.setDescription(`\`${memberArg.value.user.tag}\` (\`${memberArg.value.id}\`) has been kicked for **${reason}**`)], components: [] });

								if (memberArg.value.kickable) await memberArg.value.kick(reason);
								else embed.error.setDescription('Apparently that user is not kickable :shrug:').edit();
								break;
							case 'kickDeny':
								await interaction.update({
									embeds: [embed.error.setDescription(`Command has been canceled due to denying`).setAuthor(this.context.client.user?.username!, this.context.client.user?.displayAvatarURL())],
									components: [],
								});
								break;
						}
					})
					.catch((_e) => embed.error.setDescription('You ran out of time, please try again.').edit());
			});
	}
}
