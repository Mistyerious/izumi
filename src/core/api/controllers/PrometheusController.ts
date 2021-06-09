import type { Request, Response } from 'express';
import { IzumiController } from '@api';

export class PrometheusController extends IzumiController {
	async getMetrics(_request: Request, response: Response) {
		response.header('Content-Type', register.contentType).end(await register.metrics());
	}
}
