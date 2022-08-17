export interface TweetEntity {
	id_str: string;
	full_text: string;
	in_reply_to_status_id_str: string | null;
	user: {
		name: string;
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
