import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';
import { Args, CommandContext } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { randomUUID } from 'crypto';
import { IWarnedUser } from '@typings';
import { Utilities } from '@shared';

@ApplyOptions<IzumiCommand.Options>({
	name: 'warn',
	userPermissions: ['MANAGE_MESSAGES'],
	subCommands: ['edit', 'remove', 'list', { input: 'add', default: true }],
})
export default class Warns extends IzumiCommand {
	async add(message: Message, args: Args, context: CommandContext) {
		const member = await args.pickResult('member');
		const reason = (await args.restResult('string'))?.value ?? 'No reason provided';

		if (!member.success) return message.embed.error.setDescription('Please provide a valid member to warn').reply({ users: [message.author.id], roles: [] });

		prisma.warns
			.create({
				data: {
					guildId: message.guild?.id!,
					caseId: randomUUID(),
					moderator: message.author.id,
					timestamp: Date.now().toString(),
					reason,
					userId: member.value.id,
				},
			})
			.then((warn) => {
				message.embed.success
					.setThumbnail(member.value.user.displayAvatarURL({ dynamic: true }))
					.setDescription(`\`${member.value.user.tag}\` (\`${member.value.id}\`) has been warned for **${reason}**`)
					.setFooter(`Update reason with ${context.commandPrefix}warn edit [caseId] [reason] | CaseID ${warn.caseId}`)
					.reply();
			})
			.catch((error) => {
				this.context.logger.error(error);
				message.embed.error.setDescription('There was an error warning that user, please let the developers know').reply();
			});
	}

	async edit(message: Message, args: Args) {
		const caseId = await args.pickResult('string');
		const reason = await args.restResult('string');

		if (!caseId.success)
			return message.embed.error.setDescription('Please provide a caseID').reply({
				users: [message.author.id],
				roles: [],
			});

		if (!reason.success)
			return message.embed.error.setDescription('Please provide a reason to update with').reply({
				users: [message.author.id],
				roles: [],
			});

		const caseData = await prisma.warns.findFirst({ where: { caseId: caseId.value, AND: { guildId: message.guild?.id } } });
		if (!caseData) return message.embed.error.setDescription(`There is no case with the id of **${caseId.value}**`).reply();

		prisma.warns
			.update({ where: { caseId: caseId.value }, data: { reason: reason.value } })
			.then(() => {
				message.embed.success
					.setDescription(`Reason of \`${caseId.value}\` has been updated from **${caseData.reason}** to **${reason.value}**`)
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.reply();
			})
			.catch((error) => {
				this.context.logger.error(error);
				message.embed.fatal.setDescription('There was an error updating the case, please alert the developers.').reply();
			});
	}

	async remove(message: Message, args: Args) {
		const caseID = await args.pickResult('string');

		if (!caseID.success)
			return message.embed.error.setDescription('Please provide a caseID').reply({
				users: [message.author.id],
				roles: [],
			});

		const caseData = await prisma.warns.findFirst({ where: { caseId: caseID.value, AND: { guildId: message.guild?.id } } });
		if (!caseData) return message.embed.error.setDescription(`There is no case with the id of **${caseID.value}**`).reply();

		prisma.warns
			.delete({ where: { caseId: caseData.caseId } })
			.then(() => {
				message.embed.success
					.setDescription(`Case  \`${caseID.value}\` has been deleted`)
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.reply();
			})
			.catch((error) => {
				this.context.logger.error(error);
				message.embed.fatal.setDescription('There was an error removing the case, please alert the developers.').reply();
			});
	}

	async list(message: Message, args: Args) {
		const member = await args.pickResult('member');
		const page = (await args.pickResult('number')) ?? 1;

		if (!member.success) return message.embed.error.setDescription('Please provide a valid member').reply();

		const warnings = await prisma.warns.findMany({ where: { userId: member.value.id, guildId: message.guild?.id } });

		const embedPages: IWarnedUser[] | undefined = Utilities.pages<IWarnedUser>(warnings, 10, page.value);
		if (!embedPages) return message.embed.error.setDescription("This page doesn't exist").reply();

		message.embed.success
			.setTitle(`${warnings.length} Warnings for ${member.value.user.tag} (${member.value.id})`)
			.setDescription(embedPages.map((i: IWarnedUser) => `**ID:** \`${i.caseId}\` | **Moderator:** <@!${i.moderator}>\n${i.reason} - ${new Date(parseInt(i.timestamp)).toLocaleString()}\n`).join('\n'))
			.reply();
	}
}
