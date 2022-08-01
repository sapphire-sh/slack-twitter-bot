import Twit from 'twit';
import { SubscriptionType, TwitterApiUrlTable } from '../constants';
import { TweetEntity } from '../entities';
import { Subscription } from '../models';
import { DatabaseService } from './DatabaseService';

export class TwitterService {
	private readonly twit: Twit;

	public constructor(config: Twit.Options) {
		this.twit = new Twit(config);
	}

	public async fetch(subscription: Subscription): Promise<TweetEntity[]> {
		console.log('twitter', new Date(), 'fetch', subscription.id);

		const database = new DatabaseService();

		const since_id = await database.getLastTweetId(subscription.id);

		const getParams = (type: Subscription['type']) => {
			switch (type) {
				case SubscriptionType.USER: {
					return {
						screen_name: subscription.value,
					};
				}
				case SubscriptionType.LIST: {
					return {
						list_id: subscription.value,
					};
				}
				case SubscriptionType.TIMELINE: {
					return {};
				}
				case SubscriptionType.SEARCH: {
					return {
						q: subscription.value,
					};
				}
			}
		};

		const url = TwitterApiUrlTable[subscription.type];
		const params = {
			...getParams(subscription.type),
			count: 200,
			tweet_mode: 'extended',
		};

		const resp = await this.twit.get(url, params);

		const getTweets = (type: Subscription['type'], resp: Twit.PromiseResponse): TweetEntity[] => {
			switch (type) {
				case SubscriptionType.SEARCH: {
					return (resp.data as any).statuses;
				}
				default: {
					return resp.data as TweetEntity[];
				}
			}
		};
		const tweets = getTweets(subscription.type, resp);

		console.log('tweets.length', tweets.length);

		if (tweets[0]) {
			await database.setLastTweetId(subscription.id, tweets[0].id_str);
		}

		return tweets
			.filter((x) => {
				if (!since_id) {
					return true;
				}
				const a = BigInt(x.id_str);
				const b = BigInt(since_id);
				return a > b;
			})
			.sort((a, b) => a.id_str.localeCompare(b.id_str));
	}
}
