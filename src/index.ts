import './core/extensions';

import { IzumiClient } from '@client';
import { IzumiLogger } from '@shared';
import { IConfig } from '@typings';

import { PrismaClient } from '@prisma/client';
import { Configuration } from '@sach1/dahlia';
import { resolve } from 'path';
import { Counter, register } from 'prom-client';

global.register = register;
global.prisma = new PrismaClient();
global.config = new Configuration(resolve(process.cwd(), 'config', 'config.yaml'));
global.prometheus = {
	commands: new Counter({ name: 'commands_total', help: 'The total number of commands used' }),
	errors: new Counter({ name: 'commands_errors', help: 'The amount of times a command has errored (non fatally)' }),
	register,
};

const {
	token,
	prefixes,
	api: { port },
}: IConfig = config.get<IConfig>('bot')!;

new IzumiClient({
	caseInsensitivePrefixes: true,
	defaultPrefix: prefixes,
	intents: ['GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_PRESENCES', 'GUILDS'],
	caseInsensitiveCommands: true,
	messageCacheMaxSize: 50,
	messageCacheLifetime: 60,
	messageSweepInterval: 100,
	allowedMentions: { repliedUser: false, parse: ['users'] },
	logger: { instance: new IzumiLogger('izumi.bot') },
}).start(token, port);
