import { settings } from '.prisma/client';
import { Configuration } from '@sach1/dahlia';
import { Guild } from 'discord.js';
import { Provider } from './Provider';
import { IGuildSettings } from '@core';

type GuildKey = string | null | undefined | Guild;

export class GuildProvider extends Provider<IGuildSettings> {
	readonly default: IGuildSettings = { prefixes: config.get('bot.prefixes')! };

	async init() {
		for (const { id, data } of await prisma.settings.findMany()) this.items.set(id, JSON.parse(data));
	}

	get<T>(key: GuildKey, path: string, defaultValue?: T): T | undefined {
		return Configuration._get<T>(this.items.get(GuildProvider.id(key)) ?? this.default, path, defaultValue);
	}

	raw(key: GuildKey): IGuildSettings {
		return this.items.get(GuildProvider.id(key)) ?? this.default;
	}

	async set(key: GuildKey, path: string, value: unknown): Promise<Record<string, any>> {
		key = GuildProvider.id(key);

		const item = this.items.get(key) ?? this.default;

		Configuration._set(item, path, value);
		this.items.set(key, item);

		return await prisma.settings.upsert({ where: { id: key }, update: { data: JSON.stringify(item) }, create: { id: key, data: JSON.stringify(item) } });
	}

	async rawSet(key: GuildKey, raw: IGuildSettings): Promise<Record<string, any>> {
		key = GuildProvider.id(key);

		const item = this.items.get(key) ?? this.default;
		const merged = { ...item, ...raw };

		this.items.set(key, { ...item, ...raw });

		return await prisma.settings.upsert({ where: { id: key }, update: { data: JSON.stringify(merged) }, create: { id: key, data: JSON.stringify(merged) } });
	}

	async delete(key: GuildKey, path: string): Promise<settings> {
		key = GuildProvider.id(key);

		const item = this.items.get(key) ?? this.default;

		Configuration._delete(item, path);
		this.items.set(key, item);

		return await prisma.settings.delete({ where: { id: key } });
	}

	async clear(key: GuildKey): Promise<settings | void> {
		key = GuildProvider.id(key);
		const item = this.items.get(key);

		if (!item) return;
		this.items.delete(key);

		return await prisma.settings.delete({ where: { id: key } });
	}

	private static id(guild: GuildKey) {
		if (guild instanceof Guild) return guild.id;
		if (guild === 'global' || !guild) return '0';
		if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;

		throw new TypeError('Guild instance is undefined. Valid instances: guildID, "global" or null.');
	}
}
