import fs from 'fs';
import path from 'path';
import { z, ZodRawShape } from 'zod';
import { dataDir } from '../constants';
import { Subscription, subscriptionSchema, TwitterToken, twitterTokenSchema } from '../models';

export class ConfigurationHelper {
	private static _instance: ConfigurationHelper | null = null;

	private readonly _subscriptions: Subscription[];
	private readonly _tokens: TwitterToken[];

	private constructor() {
		this._subscriptions = this.import('subscriptions.json', subscriptionSchema);
		this._tokens = this.import('tokens.json', twitterTokenSchema);

		const subscriptionIds = this._subscriptions.map((x) => x.id);
		for (const [key, subscriptionId] of Object.entries(subscriptionIds)) {
			const p = parseInt(key, 10);
			const q = subscriptionIds.indexOf(subscriptionId);
			if (p !== q) {
				throw new Error(`duplicate subscription id: ${subscriptionId}`);
			}
		}

		for (const subscription of this._subscriptions) {
			if (this._tokens.length <= subscription.user) {
				throw new Error(`cannot find twitter token for subscription: ${subscription.id}, ${subscription.user}`);
			}
		}
	}

	public static get instance(): ConfigurationHelper {
		if (!this._instance) {
			this._instance = new ConfigurationHelper();
		}
		return this._instance;
	}

	private import<T extends ZodRawShape>(filename: string, schema: z.ZodObject<T>): z.infer<typeof schema>[] {
		const filePath = path.resolve(dataDir, filename);
		const buffer = fs.readFileSync(filePath);
		const data = JSON.parse(`${buffer}`);

		try {
			return z.array(schema).parse(data);
		} catch (error) {
			if (error instanceof z.ZodError) {
				for (const _error of error.errors) {
					console.error(_error);
				}
			} else {
				console.error(error);
			}

			throw new Error('invalid configuration');
		}
	}

	public get subscriptions(): Subscription[] {
		return this._subscriptions;
	}

	public get tokens(): TwitterToken[] {
		return this._tokens;
	}
}

const p = z.object({});
