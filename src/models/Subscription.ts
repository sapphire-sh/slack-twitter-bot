import { z } from 'zod';
import { SubscriptionType, SubscriptionAttributeType } from '../constants';

const attributeTypeSchema = z.nativeEnum(SubscriptionAttributeType);
const attributeTypeTupleSchema = z.tuple([attributeTypeSchema, z.string()]);

const attributeSchema = z.union([attributeTypeSchema, attributeTypeTupleSchema]);

export type Attibute = z.infer<typeof attributeSchema>;

export const subscriptionSchema = z.object({
	id: z.number(),
	type: z.nativeEnum(SubscriptionType),
	user: z.number(),
	value: z.string(),
	url: z.string().url(),
	attributes: z.array(attributeSchema),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
