import { IzumiClient, IzumiLogger } from '@core';
import { Configuration } from '@sach1/dahlia';
import { resolve } from 'path';

const config = new Configuration(resolve(process.cwd(), 'config', 'config.yaml'));

interface IConfig {
	token: string;
	prefixes: Array<string>;
	owners: Array<string>;
	statuses: Array<string>;
}

(async () => {
	const { token, prefixes, statuses }: IConfig = config.get<IConfig>('bot')!;

	await new IzumiClient(
		{
			caseInsensitivePrefixes: true,
			defaultPrefix: prefixes,
			presence: {
				activity: {
					type: 'WATCHING',
					name: statuses.random(),
				},
			},
			disableMentions: 'everyone',
			caseInsensitiveCommands: true,
			logger: {
				instance: new IzumiLogger('izumi.bot'),
			},
		},
		config,
	).start(token);
})();
