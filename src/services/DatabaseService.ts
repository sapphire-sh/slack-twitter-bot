import { Knex } from 'knex';
import { TableName } from '../constants';
import { HistoryEntity } from '../entities';
import { DatabaseHelper } from '../helpers';

export class DatabaseService {
	private readonly knex: Knex;

	public constructor() {
		this.knex = DatabaseHelper.instance.connection;
	}

	private async initializeTable(name: string, callback: (table: Knex.CreateTableBuilder) => void) {
		console.log('database', new Date(), 'initializeTable', name);

		const exists = await this.knex.schema.hasTable(name);
		if (exists) {
			return;
		}

		await this.knex.schema.createTable(name, callback);
	}

	public async initialize() {
		console.log('database', new Date(), 'initialize');

		await this.initializeTable(TableName.HISTORY, (table) => {
			table.integer('subscription_id').primary();
			table.string('tweet_id').notNullable();
			table.timestamps(true, true);
		});
	}

	public async getLastTweetId(subscription_id: number): Promise<string | null> {
		console.log('database', new Date(), 'getLastTweetId', subscription_id);

		const knex = this.knex<HistoryEntity>(TableName.HISTORY);
		const rows = await knex.where('subscription_id', subscription_id).limit(1);
		if (!rows[0]) {
			return null;
		}
		return rows[0].tweet_id;
	}

	public async setLastTweetId(subscription_id: number, tweet_id: string) {
		console.log('database', new Date(), 'setLastTweetId', subscription_id, tweet_id);

		const knex = this.knex<HistoryEntity>(TableName.HISTORY);
		return await knex.insert({ subscription_id, tweet_id }).onConflict(`subscription_id`).merge();
	}
}
