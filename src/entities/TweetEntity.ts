export interface TweetEntity {
	created_at: string;
	id_str: string;
	full_text: string;
	in_reply_to_status_id_str: string | null;
	user: {
		name: string;
		screen_name: string;
		profile_image_url_https: string;
	};
	entities?: {
		media?: TweetMediaEntity[];
	};
	extended_entities?: {
		media?: TweetMediaEntity[];
	};
	retweeted_status?: TweetEntity;
	possibly_sensitive?: boolean;
}

export type TweetMediaEntity = TweetMediaPhotoEntity | TweetMediaVideoEntity;

export interface TweetMediaPhotoEntity {
	id_str: string;
	media_url_https: string;
	type: 'photo';
}

export interface TweetMediaVideoEntity {
	id_str: string;
	media_url_https: string;
	type: 'video' | 'animated_gif';
	video_info: {
		variants: {
			bitrate?: number;
			content_type: string;
			url: string;
		}[];
	};
}
