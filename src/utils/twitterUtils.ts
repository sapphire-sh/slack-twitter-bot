import { TweetEntity } from '../entities';

export const getTweetUrl = (tweet: TweetEntity, stripRetweets = false): string => {
	if (stripRetweets && !!tweet.retweeted_status) {
		return getTweetUrl(tweet.retweeted_status);
	}
	const { id_str, user } = tweet;
	return `https://twitter.com/${user.screen_name}/status/${id_str}`;
};

export const getTwitterMedia = (tweet: TweetEntity): any[] => {
	return tweet.extended_entities?.media ?? [];
};
