import { Subscription } from '../models';

export * from './path';

export enum SubscriptionAttributeType {
	STRIP_RETWEETS = 'strip_retweets',
	IGNORE_RETWEETS = 'ignore_retweets',
	IGNORE_NON_MEDIA_TWEETS = 'ignore_non_media_tweets',
	IGNORE_SENSITIVE_TWEETS = 'ignore_sensitive_tweets',
	FILTER_KEYWORDS = 'filter_keywords',
}

export enum SubscriptionType {
	USER = 'user',
	LIST = 'list',
	TIMELINE = 'timeline',
	SEARCH = 'search',
}

export enum TableName {
	HISTORY = 'history',
}

export const TwitterApiUrlTable: Record<Subscription['type'], string> = {
	[SubscriptionType.USER]: 'statuses/user_timeline',
	[SubscriptionType.LIST]: 'lists/statuses',
	[SubscriptionType.TIMELINE]: '', // TODO: timeline
	[SubscriptionType.SEARCH]: 'search/tweets',
};
