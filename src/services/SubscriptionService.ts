import { SubscriptionType } from '../constants';
import { ConfigurationHelper } from '../helpers';
import { Subscription } from '../models';
import { SlackService } from './SlackService';
import { TwitterService } from './TwitterService';

export class SubscriptionService {
	public constructor() {}

	private async executeSingle(subscription: Subscription) {
		console.log('subscription', new Date(), 'executeSingle', subscription.id);

		switch (subscription.type) {
			case SubscriptionType.LIST:
			case SubscriptionType.TIMELINE:
			case SubscriptionType.USER:
			case SubscriptionType.SEARCH: {
				const token = ConfigurationHelper.instance.tokens[subscription.user];
				if (!token) {
					throw new Error(`cannot find twitter token`);
				}

				const ts = new TwitterService(token);
				const entry = await ts.fetch(subscription);

				const ss = new SlackService();
				await ss.sendTwitter(subscription, entry);

				return;
			}
		}
	}

	public async execute() {
		console.log('subscription', new Date(), 'execute');

		for (const subscription of ConfigurationHelper.instance.subscriptions) {
			try {
				await this.executeSingle(subscription);
			} catch (error) {
				console.log(error);
			}
		}
	}
}
