export * from './classes';
export * from './Interfaces';

import type { PrismaClient } from '@prisma/client';
import type { Configuration } from '@sach1/dahlia';
import './extensions';

declare global {
	interface Array<T> {
		random(): T;
		progress(): T;
		removeDuplicates(): T;
	}

	interface String {
		toDotCase(): string;
	}

	var prisma: PrismaClient;
	var config: Configuration;

	type Ctor<A extends readonly any[], R = any> = new (...args: A) => R;
}
