import * as yup from 'yup';
import { SubscriptionType, SubscriptionAttributeType } from '../constants';

export const subscriptionSchema = yup.object({
	id: yup.number().required(),
	type: yup.mixed<SubscriptionType>().oneOf(Object.values(SubscriptionType)).required(),
	user: yup.number().required(),
	value: yup.string().required(),
	url: yup.string().url().required(),
	attributes: yup
		.array()
		.of(yup.mixed<SubscriptionAttributeType>().oneOf(Object.values(SubscriptionAttributeType)).required())
		.ensure(),
});

export type Subscription = yup.InferType<typeof subscriptionSchema>;
