import { DatabaseService, SubscriptionService } from './services';

export class App {
	public async initialize() {
		console.log('app', new Date(), 'initialize');

		const s = new DatabaseService();
		await s.initialize();
	}

	public async process() {
		console.log('app', new Date(), 'process');

		const s = new SubscriptionService();
		await s.execute();
	}
}
