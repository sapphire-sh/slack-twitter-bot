import { SubscriptionAttributeType } from '../constants';
import { Attibute } from '../models';

export const getFilterKeywords = (attributes: Attibute[]): string[] => {
	return attributes
		.filter((x): x is [SubscriptionAttributeType, string] => Array.isArray(x))
		.filter((x) => x[0] === SubscriptionAttributeType.FILTER_KEYWORDS)
		.map((x) => x[1]);
};
