import { Application, Router } from 'express';

export abstract class IzumiRouter {
	readonly router: Router = Router();

	abstract start(server: Application): unknown;
}
