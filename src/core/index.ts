export * from './classes';

import './extensions';

declare global {
	interface Array<T> {
		random(): T;
	}

	interface String {
		toDotCase(): string;
	}
}
