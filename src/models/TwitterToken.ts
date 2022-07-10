import * as yup from 'yup';

export const twitterTokenSchema = yup.object({
	consumer_key: yup.string().required(),
	consumer_secret: yup.string().required(),
	access_token: yup.string().required(),
	access_token_secret: yup.string().required(),
});

export type TwitterToken = yup.InferType<typeof twitterTokenSchema>;
