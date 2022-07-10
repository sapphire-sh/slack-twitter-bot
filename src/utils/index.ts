export * from './twitterUtils';

export const sleep = async (ms: number) => {
	return await new Promise(x => setTimeout(x, ms));
};
