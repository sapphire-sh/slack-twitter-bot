import fs from 'fs';
import path from 'path';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { dataDir } from '../constants';
import { Subscription, subscriptionSchema, TwitterToken, twitterTokenSchema } from '../models';

export class ConfigurationHelper {
	private static _instance: ConfigurationHelper | null = null;

	private readonly _subscriptions: Subscription[];
	private readonly _tokens: TwitterToken[];

	private constructor() {
		this._subscriptions = this.import('subscriptions.json', subscriptionSchema);
		this._tokens = this.import('tokens.json', twitterTokenSchema);

		const subscriptionIds = this._subscriptions.map(x => x.id);
		for(const [key, subscriptionId] of Object.entries(subscriptionIds)) {
			const p = parseInt(key, 10);
			const q = subscriptionIds.indexOf(subscriptionId);
			if(p !== q) {
				throw new Error(`duplicate subscription id: ${subscriptionId}`);
			}
		}

		for(const subscription of this._subscriptions) {
			if(this._tokens.length <= subscription.user) {
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

	private import<T extends ObjectShape>(filename: string, schema: ReturnType<typeof yup.object<T>>): yup.InferType<typeof schema>[] {
		const filePath = path.resolve(dataDir, filename);
		const buffer = fs.readFileSync(filePath);
		const data = JSON.parse(`${buffer}`);

		try {
			return yup.array().of(schema).required().validateSync(data);
		}
		catch(error) {
			if(!(error instanceof yup.ValidationError)) {
				console.error(error);
				throw new Error('invalid configuration');
			}

			throw new Error(error.errors.join('\n'))
		}
	}

	public get subscriptions(): Subscription[] {
		return this._subscriptions;
	}

	public get tokens(): TwitterToken[] {
		return this._tokens;
	}
}
