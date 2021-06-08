export interface IConfig {
	token: string;
	prefixes: Array<string>;
	owners: Array<string>;
	statuses: Array<string>;
}

export interface IGuildSettings {
	prefixes: Array<string>;
}
