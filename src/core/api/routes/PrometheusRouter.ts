import { logger, PrometheusController, IzumiRouter } from '@api';
import type { Application } from 'express';

export class PrometheusRouter extends IzumiRouter {
	constructor(private readonly controller: PrometheusController) {
		super();
	}

	start(server: Application) {
		this.router.get('/metrics', this.controller.getMetrics);
		server.use(this.router);

		logger.info('Prometheus router started');
	}
}
