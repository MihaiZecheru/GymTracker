import { DateInMS, EntryID, TExcersize, UserID } from "./types";

/**
 * Represents a User in the database.
 * Note that the user does not have a password,
 * since this is just a small app for people I know
 */
export interface IUser {
	user_id: UserID;
	username: string;
}

/**
 * Represents an excersize-entry in the database.
 * An excersize-entry is a single instance of an excersize being done.
 * It has a number of reps, a weight per rep, a sum of the weight that was lifted.
 */
export interface IEntry {
  entry_id: EntryID;
	reps: number; // int
	weight_per_rep: number; // float
	weight_sum: number; // float
	date: DateInMS; // int
}

/**
 * Represents a collection of excersize-entries in the database.
 * An entry collection is a collection of entries for a single excersize.
 */
export interface IEntryCollection {
	user_id: UserID;
	excersize: TExcersize;
	entries: Array<EntryID>;
}