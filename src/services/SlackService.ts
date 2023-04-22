import { sleep } from '@sapphire-sh/utils';
import axios from 'axios';
import { SubscriptionAttributeType } from '../constants';
import { TweetEntity } from '../entities';
import { Subscription } from '../models';
import { getFilterKeywords, getTweetUrl, getTwitterBlocks, getTwitterMedia, hasTweetKeyword } from '../utils';

export class SlackService {
	public async sendInternal(url: string, username: string, blocks: MessageBlock[]) {
		console.log('slack', new Date(), 'sendInternal', url, username, blocks.length);

		await axios.request({
			method: 'POST',
			url,
			headers: { 'Content-Type': 'application/json' },
			data: { username, blocks },
		});
	}

	public async sendTwitter(subscription: Subscription, tweets: TweetEntity[]) {
		console.log('slack', new Date(), 'sendTwitter', tweets.length);

		const flags = {
			stripRetweets: subscription.attributes.includes(SubscriptionAttributeType.STRIP_RETWEETS),
			ignoreRetweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_RETWEETS),
			ignoreNonMediaTweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_NON_MEDIA_TWEETS),
			ignoreSensitiveTweets: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_SENSITIVE_TWEETS),
			ignoreReplies: subscription.attributes.includes(SubscriptionAttributeType.IGNORE_REPLIES),
			filterKeywords: getFilterKeywords(subscription.attributes),
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

				if (flags.ignoreReplies && tweet.in_reply_to_status_id_str !== null) {
					continue;
				}

				if (flags.filterKeywords.some((keyword) => hasTweetKeyword(tweet, keyword))) {
					continue;
				}

				// const text = getTweetUrl(tweet, flags.stripRetweets);
				const blocks = getTwitterBlocks(tweet, flags.stripRetweets);
				await this.sendInternal(subscription.url, tweet.user.screen_name, blocks);

				await sleep(100);
			} catch (error) {
				console.log(error);
			}
		}
	}
}
