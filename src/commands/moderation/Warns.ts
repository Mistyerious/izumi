import { IzumiCommand } from '@client';
import type { Message } from 'discord.js';
import { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { MessageEmbed } from 'discord.js';
import { randomUUID } from 'crypto';
import { IWarnedUser } from '@interfaces';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: 'warn',
	subCommands: ['edit', 'remove', 'list', { input: 'warn', default: true }],
})
export default class Warns extends IzumiCommand {
	async warn(msg: Message, args: Args, context: CommandContext) {
		const member = await args.pickResult('member');
		const reason = (await args.restResult('string'))?.value ?? 'No reason provided';

		if (!member.success) return msg.embed.error.setDescription('Please provide a valid member to warn').reply({ users: [msg.author.id], roles: [] });
		const caseID = randomUUID();
		await prisma.warns
			.create({
				data: {
					guildId: msg.guild?.id!,
					caseId: caseID,
					moderator: msg.author.id,
					timestamp: Date.now().toString(),
					reason: reason,
					userId: member.value.id,
				},
			})
			.catch((e) => {
				console.log(e);
				return msg.channel.send('There was an error warning that user, please let the developers know');
			});

		await msg.embed.success
			.setThumbnail(member.value.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`\`${member.value.user.tag}\` (\`${member.value.id}\`) has been warned for **${reason}**`)
			.setFooter(`Update reason with ${context.commandPrefix}warn edit [caseId] [reason] | CaseID (${caseID})`)
			.send();
	}
	async edit(msg: Message, args: Args) {
		const caseID = await args.pickResult('string');
		const reason = await args.restResult('string');

		if (!caseID.success)
			return msg.embed.error.setDescription('Please provide a caseID').reply({
				users: [msg.author.id],
				roles: [],
			});
		if (!reason.success)
			return msg.embed.error.setDescription('Please provide a reason to update with').reply({
				users: [msg.author.id],
				roles: [],
			});

		const caseData = await prisma.warns.findFirst({ where: { caseId: caseID.value } });

		if (!caseData) return msg.embed.error.setDescription(`There is no case with the id of **${caseID.value}**`).send();

		await prisma.warns.update({ where: { caseId: caseID.value }, data: { reason: reason.value } }).catch((e) => {
			console.log(e);
			return msg.embed.fatal.setDescription('There was an error updating the case, please alert the developers.');
		});

		return msg.embed.success
			.setDescription(`Reason of \`${caseID.value}\` has been updated from **${caseData.reason}** to **${reason.value}**`)
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
			.send();
	}

	async remove(msg: Message, args: Args) {
		const caseID = await args.pickResult('string');

		if (!caseID.success)
			return msg.embed.error.setDescription('Please provide a caseID').reply({
				users: [msg.author.id],
				roles: [],
			});

		const caseData = await prisma.warns.findFirst({ where: { caseId: caseID.value } });

		if (!caseData) return msg.embed.error.setDescription(`There is no case with the id of **${caseID.value}**`).send();

		await prisma.warns.delete({ where: { caseId: caseID.value } });

		return msg.embed.success
			.setDescription(`Case with the ID of \`${caseID.value}\` has been deleted`)
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
			.send();
	}

	async list(msg: Message, args: Args) {
		const member = await args.pickResult('member');
		const page = (await args.pickResult('number')) ?? 1;

		if (!member.success) return msg.embed.error.setDescription('Please provide a valid member').send();

		const warnings = await prisma.warns.findMany({ where: { userId: member.value.id } });

		const embedPages: IWarnedUser[] | undefined = this.pages<IWarnedUser>(warnings, 10, page.value);

		if (!embedPages) return msg.embed.error.setDescription("This page doesn't exist").send();

		return msg.embed.success
			.setTitle(`${warnings.length} Warnings for ${member.value.user.tag} (${member.value.id})`)
			.setDescription(embedPages.map((i: IWarnedUser, index: number) => `**ID:** \`${i.caseId}\` | **Moderator:** <@!${i.moderator}>\n${i.reason} - ${new Date(parseInt(i.timestamp)).toLocaleString()}\n`).join('\n'))
			.send();
	}

	private pages = <T>(arr: T[], itemsPerPage: number, page = 1): T[] | undefined => {
		const maxPages: number = Math.ceil(arr.length / itemsPerPage);
		if (page < 1 || page > maxPages) return;
		return arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
	};
}
