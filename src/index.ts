import { PrismaClient } from '.prisma/client';
import { IConfig, IzumiClient, IzumiLogger } from '@core';
import { Configuration } from '@sach1/dahlia';
import { resolve } from 'path';

global.prisma = new PrismaClient();
global.config = new Configuration(resolve(process.cwd(), 'config', 'config.yaml'));

const { token, prefixes, statuses }: IConfig = config.get<IConfig>('bot')!;

new IzumiClient(
	{
		caseInsensitivePrefixes: true,
		defaultPrefix: prefixes,
		presence: { activity: { type: 'WATCHING', name: statuses.progress() } },
		disableMentions: 'everyone',
		caseInsensitiveCommands: true,
		logger: { instance: new IzumiLogger('izumi.bot') },
	},
	config,
).start(token);
