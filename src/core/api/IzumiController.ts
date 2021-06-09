import type { NextFunction, Request, Response } from 'express';

export abstract class IzumiController {
	private readonly _key: string = config.get('bot.api.key')!;

	send(response: Response) {
		return (status: number, message: Record<string, unknown>) => {
			response.status(status).json(message);
		};
	}

	_protectEndpointMiddleware(request: Request, response: Response, next: NextFunction) {
		if (!request.headers.authorization || request.headers.authorization !== this._key) return this.send(response)(401, { message: 'Unauthorized', success: false });
		next();
	}
}
