import type { PrismaClient } from '@prisma/client';
import type { Configuration } from '@sach1/dahlia';
import type { Counter, Registry } from 'prom-client';

import './extensions';

interface IPrometheus {
	commands: Counter<string>;
	errors: Counter<string>;
	register: Registry;
}

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
	var prometheus: IPrometheus;
	var register: Registry;
}