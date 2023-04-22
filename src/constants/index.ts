import { Subscription } from '../models';

export * from './path';

export enum SubscriptionAttributeType {
	STRIP_RETWEETS = 'strip_retweets',
	IGNORE_RETWEETS = 'ignore_retweets',
	IGNORE_NON_MEDIA_TWEETS = 'ignore_non_media_tweets',
	IGNORE_SENSITIVE_TWEETS = 'ignore_sensitive_tweets',
	IGNORE_REPLIES = 'ignore_replies',
	FILTER_KEYWORDS = 'filter_keywords',
}

export enum SubscriptionType {
	SYSTEM = 'system',
	USER = 'user',
	LIST = 'list',
	TIMELINE = 'timeline',
	SEARCH = 'search',
}

export enum TableName {
	HISTORY = 'history',
}

export const TwitterApiUrlTable: Record<Subscription['type'], string> = {
	[SubscriptionType.SYSTEM]: '',
	[SubscriptionType.USER]: 'statuses/user_timeline',
	[SubscriptionType.LIST]: 'lists/statuses',
	[SubscriptionType.TIMELINE]: '', // TODO: timeline
	[SubscriptionType.SEARCH]: 'search/tweets',
};
