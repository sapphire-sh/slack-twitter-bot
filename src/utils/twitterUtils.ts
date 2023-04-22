import { TweetEntity, TweetMediaEntity } from '../entities';

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

export const getTwitterBlocks = (tweet: TweetEntity, stripRetweets = false): MessageBlock[] => {
	if (stripRetweets && !!tweet.retweeted_status) {
		return getTwitterBlocks(tweet.retweeted_status);
	}

	const blocks: MessageBlock[] = [
		{
			type: 'context',
			elements: [
				{
					type: 'image',
					image_url: tweet.user.profile_image_url_https,
					alt_text: tweet.user.name,
				},
				{
					type: 'mrkdwn',
					text: `${tweet.user.name} <https://twitter.com/${tweet.user.screen_name}|@${tweet.user.screen_name}>`,
				},
				{
					type: 'mrkdwn',
					text: tweet.created_at,
				},
				{
					type: 'mrkdwn',
					text: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
				},
			],
		},
		{
			type: 'section',
			text: {
				type: 'plain_text',
				text: tweet.full_text,
			},
		},
	];

	if (tweet.extended_entities?.media) {
		const mediaBlocks = getTwitterMediaBlocks(tweet.extended_entities.media);
		for (const mediaBlock of mediaBlocks) {
			blocks.push(mediaBlock);
		}
	}

	return blocks;
};

export const getTwitterMediaBlocks = (media: TweetMediaEntity[]): MessageBlock[] => {
	return media.map((medium) => {
		switch (medium.type) {
			case 'photo': {
				return {
					type: 'image',
					title: {
						type: 'plain_text',
						text: medium.media_url_https,
						emoji: true,
					},
					image_url: `${medium.media_url_https}:orig`,
					alt_text: medium.media_url_https,
				};
			}
			case 'video':
			case 'animated_gif': {
				const url = medium.video_info.variants
					.filter((e) => {
						return e.content_type.startsWith('video');
					})
					.sort((a, b) => {
						return (b.bitrate ?? 0) - (a.bitrate ?? 0);
					})[0]?.url;

				return {
					type: 'video',
					title: {
						type: 'plain_text',
						text: url,
					},
					title_url: url,
					video_url: url,
					alt_text: url,
					thumbnail_url: medium.media_url_https,
				};
			}
		}
	});
};
