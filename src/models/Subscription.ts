import { z } from 'zod';
import { SubscriptionType, SubscriptionAttributeType } from '../constants';

export const subscriptionSchema = z.object({
	id: z.number(),
	type: z.nativeEnum(SubscriptionType),
	user: z.number(),
	value: z.string(),
	url: z.string().url(),
	attributes: z.array(z.nativeEnum(SubscriptionAttributeType)),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
