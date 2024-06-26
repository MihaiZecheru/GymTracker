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
async function MakeIEntry(reps: number, weight_per_rep: number, date: DateInMS): Promise<IEntry> {
	return { entry_id: await MakeID(), reps, weight_per_rep, weight_sum: reps * weight_per_rep, date, } as IEntry;
}

/**
 * Database schema consists of a table of users, a table of entries, and a table of entry collections.
 **/
export default abstract class Database {
  private static db = new sqlite3.Database('./gym.db')!;

  /**
   * Get a user from the database
   */
	public static async GetUser(user_id: UserID): Promise<IUser | null> {
		return new Promise((resolve) => {
      this.db.get(`SELECT * FROM Users WHERE user_id = ?`, user_id, (err, row) => {
        if (err) {
          console.error(err);
          throw err;
        }
  
        resolve(row as IUser | null);
      });
    });
	}

  /**
   * Get an entry collection from the database
   * @param excersize The excersize the entry collection represents
   */
	public static async GetEntryCollection(user_id: UserID, excersize: TExcersize): Promise<IEntryCollection> {
		return new Promise((resolve) => {
      this.db.get(`SELECT * FROM ExcersizeEntryCollection WHERE user_id = ? AND excersize = ?`, user_id, excersize, (err: Error | null, row: unknown) => {
        if (err) {
          console.error(err);
          throw err;
        }

        // @ts-ignore
        if (row) row.entries = JSON.parse(row.entries);
        resolve(row as IEntryCollection);
      });
    });
	}

  /**
   * Update an entry collection in the database, usually to add a new entry to the collection
   * @param excersize The excersize the entry collection represents
   * @param entry_id The ID of the entry to add to the collection. It must already exist in the database.
   */
	public static async UpdateEntryCollection(user_id: UserID, excersize: TExcersize, entry_id: EntryID): Promise<void> {
		const entry_collection = await this.GetEntryCollection(user_id, excersize);
    entry_collection.entries.push(entry_id);
    
    return new Promise((resolve) => {
      this.db.run(`UPDATE ExcersizeEntryCollection SET entries = ? WHERE user_id = ? AND excersize = ?`, JSON.stringify(entry_collection.entries), user_id, excersize, (err: Error | null) => {
        if (err) {
          console.error(err);
          throw err;
        }

        resolve();
      });
    });
	}

  /**
   * Create a new entry collection object in the database
   * @param excersize The excersize to create an entry collection for
   */
  public static async MakeEntryCollection(user_id: UserID, excersize: TExcersize): Promise<void> {
    return new Promise((resolve) => {
      this.db.run(`INSERT INTO ExcersizeEntryCollection (user_id, excersize, entries) VALUES (?, ?, ?)`, user_id, excersize, JSON.stringify([]), (err: Error | null) => {
        if (err) {
          console.error(err);
          throw err;
        }

        resolve();
      });
    });
  }

  /**
   * Post an IEntry to the database
   * @param entry The entry to post to the database. Must be made with the MakeIEntry function
   */
  public static async PostEntryToDB(entry: IEntry): Promise<void> {
    return new Promise((resolve) => {
      this.db.run(`INSERT INTO ExcersizeEntry (entry_id, reps, weight_per_rep, weight_sum, date) VALUES (?, ?, ?, ?, ?)`, entry.entry_id, entry.reps, entry.weight_per_rep, entry.weight_sum, entry.date, (err: Error | null) => {
        if (err) {
          console.error(err);
          throw err;
        }

        resolve();
      });
    });
  }

  /**
   * Add an entry to the database and update the entry collection it belongs to
   * @param excersize The excersize that was done
   * @param reps The amount of reps that were done (int)
   * @param weight_per_rep The amount of weight that was lifted per rep (float)
   */
	public static async AddEntry(user_id: UserID, excersize: TExcersize, reps: number, weight_per_rep: number, noSum: boolean = false): Promise<void> {
		const entry: IEntry = await MakeIEntry(reps, weight_per_rep, Date.now());
    if (noSum) entry.weight_sum = -1;
    await this.PostEntryToDB(entry);
		let entry_collection: IEntryCollection = await this.GetEntryCollection(user_id, excersize);
    if (!entry_collection) this.MakeEntryCollection(user_id, excersize);
		this.UpdateEntryCollection(user_id, excersize, entry.entry_id);
	}

  /**
   * Check to see if the given <id> has not yet been used in the database.
   * @param id The ID to check for availability
   */
  public static async IDAvailable(id: string): Promise<boolean> {
    const excersizeEntry = new Promise((resolve) => {
      this.db.get(`SELECT * FROM ExcersizeEntry WHERE entry_id = ?`, id, (err, row) => {
        if (err) {
          console.error(err);
          throw err;
        }
  
        resolve(row === undefined);
      });
    });

    const users = new Promise((resolve) => {
      this.db.get(`SELECT * FROM Users WHERE user_id = ?`, id, (err, row) => {
        if (err) {
          console.error(err);
          throw err;
        }
  
        resolve(row === undefined);
      });
    });

    return await Promise.all([excersizeEntry, users]).then((r) => {
      return r.every((available) => available === true);
    });
  }

  /**
   * Get a list of entries from the database using the given IDs
   * @param entry_ids The IDs of the entries to get from the database
   */
  public static async GetEntriesWithIDs(entry_ids: Array<EntryID>): Promise<Array<IEntry>> {
    return new Promise((resolve) => {
      this.db.all(`SELECT * FROM ExcersizeEntry WHERE entry_id IN (${entry_ids.map((id) => `'${id}'`).join(", ")})`, (err, rows) => {
        if (err) {
          console.error(err);
          throw err;
        }

        resolve(rows as Array<IEntry>);
      });
    });
  }

  /**
   * Get all entry collections for a given user
   * @param user_id The user to get the entry collections for
   */
  public static async GetAllEntryCollections(user_id: UserID): Promise<Array<IEntryCollection>> {
    return new Promise((resolve) => {
      this.db.all(`SELECT * FROM ExcersizeEntryCollection WHERE user_id = ?`, user_id, (err, rows) => {
        if (err) {
          console.error(err);
          throw err;
        }

        // JSON.parse the entries
        rows.forEach((row: any) => {
          row.entries = JSON.parse(row.entries);
        });

        resolve(rows as Array<IEntryCollection>);
      });
    });
  }
}

// TODO: add tests