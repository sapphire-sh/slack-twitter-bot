export interface TweetEntity {
	id_str: string;
	user: {
		screen_name: string;
	};
	entities?: {
		media?: any[];
	};
	extended_entities?: {
		media?: any[];
	};
	retweeted_status?: TweetEntity;
	possibly_sensitive?: boolean;
}
