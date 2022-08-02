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

export const hasTweetKeyword = (tweet: TweetEntity, keyword: string): boolean => {
	const _tweet = tweet.retweeted_status ?? tweet;

	if (_tweet.user.name.includes(keyword)) {
		return true;
	}

	if (_tweet.full_text.includes(keyword)) {
		return true;
	}

	return false;
};
