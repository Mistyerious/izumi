import { settings } from '.prisma/client';
import { Configuration } from '@sach1/dahlia';
import { Collection } from 'discord.js';

export abstract class Provider<T> {
	readonly items = new Collection<string, T>();
	abstract readonly default: T;

	constructor() {}

	abstract init(): void;

	get(key: string, path: string, defaultValue?: T): T | undefined {
		return Configuration._get<T>(this.items.get(key) ?? this.default, path, defaultValue);
	}

	abstract set(key: string, path: string, value: unknown): Record<string, any> | void;
	abstract delete(key: string, path: string): Record<string, any> | void;
  abstract clear(key: string): void;
  
	raw(key: string) {
		return this.items.get(key) ?? this.default;
	}
}
