interface IAPIConfig {
	port: number;
}

export interface IConfig {
	token: string;
	prefixes: Array<string>;
	owners: Array<string>;
	statuses: Array<string>;
	api: IAPIConfig;
}

export interface IGuildSettings {
	prefixes: Array<string>;
}
