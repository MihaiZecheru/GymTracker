import { IEntry, IEntryCollection, IUser } from "./database-types";
import { DateInMS, EntryID, MakeID, TExcersize, UserID } from "./types";
import sqlite3 from 'sqlite3';

/**
 * Create a new excersize-entry in the database
 * @param reps Amount of reps done (int)
 * @param weight_per_rep Amount of weight lifted per rep (float)
 * @param date Date to log the entry (int)
 * @returns The created excersize-entry
 */
function MakeEntry(reps: number, weight_per_rep: number, date: DateInMS): IEntry {
	return { entry_id: MakeID(), reps, weight_per_rep, weight_sum: reps * weight_per_rep, date, } as IEntry;
}

/**
 * Database schema consists of a table of users, a table of entries, and a table of entry collections.
 **/
export default abstract class Database {
  private static db = new sqlite3.Database('./gym.db');

  /**
   * Get a user from the database
   */
	public static GetUser(user_id: UserID): IUser {
		// TODO: finish
    return {} as IUser;
	}

  /**
   * Get an entry collection from the database
   * @param excersize The excersize the entry collection represents
   */
	public static GetEntryCollection(user_id: UserID, excersize: TExcersize): IEntryCollection {
		// TODO: finish
    return {} as IEntryCollection;
	}

  /**
   * Update an entry collection in the database, usually to add a new entry to the collection
   * @param excersize The excersize the entry collection represents
   * @param entry_id The ID of the entry to add to the collection. It must already exist in the database.
   */
	public static UpdateEntryCollection(user_id: UserID, excersize: TExcersize, entry_id: EntryID): void {
		const entry_collection = this.GetEntryCollection(user_id, excersize);
    entry_collection.entries.push(entry_id);
    // TODO: update in DB
	}

  /**
   * Add an entry to the database and update the entry collection it belongs to
   * @param excersize The excersize that was done
   * @param reps The amount of reps that were done (int)
   * @param weight_per_rep The amount of weight that was lifted per rep (float)
   */
	public static AddEntry(user_id: UserID, excersize: TExcersize, reps: number, weight_per_rep: number): void {
		const entry = MakeEntry(reps, weight_per_rep, Date.now());
		let entry_collection: IEntryCollection = this.GetEntryCollection(user_id, excersize);
		this.UpdateEntryCollection(user_id, excersize, entry.entry_id);
	}
}