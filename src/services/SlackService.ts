import axios from 'axios';
import { SubscriptionAttributeType } from '../constants';
import { TweetEntity } from '../entities';
import { Subscription } from '../models';
import { getTweetUrl, getTwitterMedia, sleep } from '../utils';

export class SlackService {
	public async sendInternal(url: string, username: string, text: string) {
		console.log('slack', new Date(), 'sendInternal', url, username, text);

		await axios.request({
			method: 'POST',
			url,
			headers: { 'Content-Type': 'application/json' },
			data: { text, username },
		});
	}

	public async sendTwitter(subscription: Subscription, tweets: TweetEntity[]) {
		console.log('slack', new Date(), 'sendTwitter', tweets.length);

		const flags = {
			stripRetweets: subscription.attributes.includes(SubscriptionAttributeType.STRIP_RETWEETS),
			ignoreRetweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_RETWEETS),
			ignoreNonMediaTweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_NON_MEDIA_TWEETS),
			ignoreSensitiveTweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_SENSITIVE_TWEETS),
		};

		for (const tweet of tweets) {
			try {
				if (flags.ignoreRetweets && tweet.retweeted_status) {
					continue;
				}
				const media = getTwitterMedia(tweet);
				if (flags.ignoreNonMediaTweets && media.length === 0) {
					continue;
				}
				if (flags.ignoreSensitiveTweets && tweet.possibly_sensitive) {
					continue;
				}

				const text = getTweetUrl(tweet, flags.stripRetweets);
				await this.sendInternal(subscription.url, tweet.user.screen_name, text);

				await sleep(100);
			} catch (error) {
				console.log(error);
			}
		}
	}
}
