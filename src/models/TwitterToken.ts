import { z } from 'zod';

export const twitterTokenSchema = z.object({
	consumer_key: z.string(),
	consumer_secret: z.string(),
	access_token: z.string(),
	access_token_secret: z.string(),
});

export type TwitterToken = z.infer<typeof twitterTokenSchema>;
