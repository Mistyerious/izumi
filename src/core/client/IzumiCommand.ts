import { Args, Awaited, CommandContext, PermissionsPrecondition, PieceContext, PreconditionEntryResolvable } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { PermissionResolvable } from 'discord.js';
import { Message } from 'discord.js';
import { default as UserPermissionsPrecondition} from '../../preconditions/userPermissionsPrecondition';
import { sep } from 'path';

export abstract class IzumiCommand extends SubCommandPluginCommand<Args, IzumiCommand> {
	constructor(context: PieceContext, public options: IzumiCommand.Options) {
		super(context, IzumiCommand.resolvePreConditions(context, options));
	}

	run(message: Message, args: Args, context: CommandContext): Awaited<unknown> {
		if (!this.subCommands) throw new Error(`Command ${this.name} does not implement the run method nor does it support sub-commands.`);
		return this.subCommands.run({ message, args, context, command: this });
	}

	private static resolvePreConditions(context: PieceContext, options: IzumiCommand.Options): IzumiCommand.Options {
		options.generateDashLessAliases ??= true;

		const preconditions = (options.preconditions ??= []) as PreconditionEntryResolvable[];

		if (options.nsfw) preconditions.push('NSFW');
		if (options.permissions) preconditions.push(new PermissionsPrecondition(options.permissions));
		if (options.userPermissions) preconditions.push(new UserPermissionsPrecondition(context, { name: 'userPermissionsPrecondition'}))

		return options;
	}

	get category() {
		const split = this.path.split(sep);
		return split.slice(split.indexOf('commands') + 1, -1)[0];
	}
}

export namespace IzumiCommand {
	export type Options = SubCommandPluginCommand.Options & {
		nsfw?: boolean;
		permissions?: PermissionResolvable;
		userPermissions?: PermissionResolvable;
		usage?: string;
		examples?: string[];
	};

	export type Context = CommandContext;
}
