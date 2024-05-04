type Unique<T, UniqueTypeName> = T & { __TYPE__: UniqueTypeName };

/**
 * Base ID type. Eight characters long, alphanumeric.
 */
type ID = string;

/**
 * The ID of a user in the database.
 */
export type UserID = Unique<ID, "UserID">;

/**
 * The ID of an excersize-entry in the database.
 */
export type EntryID = Unique<ID, "EntryID">;

/**
 * Excersizes that can be logged.
 */
export type TExcersize = "Bench" | "Bicep Curls" | "Treadmill"; //TODO: add the rest

/**
 * The date in milliseconds since the Unix epoch.
 */
export type DateInMS = number;

const ID_LENGTH = 8;
const ID_REGEX = /^[A-Za-z0-9]{8}$/;
const ID_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generate a random ID of length ID_LENGTH without checking to see if it already exists first.
 * @returns a random ID of length ID_LENGTH
 */
function _gen_ID(): ID {
	let id_string = "";
	
	for (let i = 0; i < ID_LENGTH; i++) {
		id_string += ID_chars.charAt(Math.floor(Math.random() * ID_chars.length));
	}
	
	return id_string;
}

/**
 * Make a new ID that does not already exist.
 */
export function MakeID(): ID {
	while (true) {
		const id: ID = _gen_ID();
		// TODO: check if ID does not already exist
		return id;
	}
}

/**
 * Check if the given <id> matches the ID_REGEX.
 */
export function ValidateID(id: string): boolean {
	return ID_REGEX.test(id);
}