import { IzumiCommand } from '@client';
import { Precondition, PreconditionContext } from '@sapphire/framework';
import { PermissionString } from 'discord.js';
import { Message } from 'discord.js';

export default class UserPermissionsPrecondition extends Precondition {
	run(message: Message, command: IzumiCommand, context: PreconditionContext) {
		const missing = message.member!.permissions.missing(command.options.userPermissions ?? BigInt(0));
		if (missing?.length !== 0)
			return this.error({
				message: `I am missing the following permissions to run this command: ${missing.map((perm) => UserPermissionsPrecondition.readablePermissions[perm]).join(', ')}`,
				identifier: this.name,
				context,
			});

		return this.ok();
	}

	protected static readonly readablePermissions: Record<PermissionString, string> = {
		ADMINISTRATOR: 'Administrator',
		VIEW_AUDIT_LOG: 'View Audit Log',
		MANAGE_GUILD: 'Manage Server',
		MANAGE_ROLES: 'Manage Roles',
		MANAGE_CHANNELS: 'Manage Channels',
		KICK_MEMBERS: 'Kick Members',
		BAN_MEMBERS: 'Ban Members',
		CREATE_INSTANT_INVITE: 'Create Instant Invite',
		CHANGE_NICKNAME: 'Change Nickname',
		MANAGE_NICKNAMES: 'Manage Nicknames',
		MANAGE_EMOJIS: 'Manage Emojis',
		MANAGE_WEBHOOKS: 'Manage Webhooks',
		VIEW_CHANNEL: 'Read Messages',
		SEND_MESSAGES: 'Send Messages',
		SEND_TTS_MESSAGES: 'Send TTS Messages',
		MANAGE_MESSAGES: 'Manage Messages',
		EMBED_LINKS: 'Embed Links',
		ATTACH_FILES: 'Attach Files',
		READ_MESSAGE_HISTORY: 'Read Message History',
		MENTION_EVERYONE: 'Mention Everyone',
		USE_EXTERNAL_EMOJIS: 'Use External Emojis',
		ADD_REACTIONS: 'Add Reactions',
		CONNECT: 'Connect',
		SPEAK: 'Speak',
		STREAM: 'Stream',
		MUTE_MEMBERS: 'Mute Members',
		DEAFEN_MEMBERS: 'Deafen Members',
		MOVE_MEMBERS: 'Move Members',
		USE_VAD: 'Use Voice Activity',
		PRIORITY_SPEAKER: 'Priority Speaker',
		VIEW_GUILD_INSIGHTS: 'View Guild Insights',
		REQUEST_TO_SPEAK: 'Request To Speak',
		USE_APPLICATION_COMMANDS: 'Use Application Commands',
	};
}
