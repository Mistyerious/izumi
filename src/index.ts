import { PrismaClient } from '.prisma/client';
import { IConfig, IzumiClient, IzumiLogger } from '@core';
import { Configuration } from '@sach1/dahlia';
import { Intents } from 'discord.js';
import { resolve } from 'path';

global.prisma = new PrismaClient();
global.config = new Configuration(resolve(process.cwd(), 'config', 'config.yaml'));

const { token, prefixes }: IConfig = config.get<IConfig>('bot')!;

new IzumiClient({
	caseInsensitivePrefixes: true,
	defaultPrefix: prefixes,
	intents: Intents.ALL,
	caseInsensitiveCommands: true,
	messageCacheMaxSize: 50,
	messageCacheLifetime: 60,
	messageSweepInterval: 100,
	allowedMentions: { repliedUser: false, parse: ['users'] },
	logger: { instance: new IzumiLogger('izumi.bot') },
}).start(token);
