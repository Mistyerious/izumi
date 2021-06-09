import { logger, PrometheusController, PrometheusRouter } from '@api';
import { Application, default as express } from 'express';

// TODO: Dependency Injection

export class API {
	readonly server: Application = express();

	start(port: number) {
		for (const router of [new PrometheusRouter(new PrometheusController())]) router.start(this.server);
		this.server.listen(port, () => logger.info(`API is now online on port ${port}`));
	}
}
