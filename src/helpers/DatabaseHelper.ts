import { knex, Knex } from 'knex';
import path from 'path';
import { dataDir } from '../constants';

export class DatabaseHelper {
	private static _instance: DatabaseHelper | null = null;

	private _connection: Knex | null = null;

	private constructor() {}

	public static get instance(): DatabaseHelper {
		if (!this._instance) {
			this._instance = new DatabaseHelper();
		}
		return this._instance;
	}

	private createConnection(): Knex {
		const dbPath = path.resolve(dataDir, 'slack-twitter-bot.sqlite3');
		return knex({
			client: 'sqlite3',
			connection: {
				filename: dbPath,
			},
			useNullAsDefault: true,
		});
	}

	public get connection(): Knex {
		if (!this._connection) {
			this._connection = this.createConnection();
		}
		return this._connection;
	}
}
