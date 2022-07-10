import schedule from 'node-schedule';
import { App } from './App';

(async () => {
	try {
		const app = new App();
		await app.initialize();

		schedule.scheduleJob('*/5 * * * *', () => {
			try {
				app.process();
			} catch (error) {
				console.log(error);
			}
		});
	} catch (error) {
		console.log(error);
	}
})();
