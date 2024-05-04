import { IEntryCollection } from "../database-types";
import Database from "../database";
import Validate from "../validate";

export default function get_entry_collection(req: any, res: any): void {
	const user_id = req.params?.id;
	const excersize = req.params?.excersize;

	if (Validate(user_id, res)) return;
	if (Validate(excersize, res)) return;

	const entry_collection: IEntryCollection = Database.GetEntryCollection(user_id, excersize);
	if (entry_collection === null) return res.code(400).send(`No entry collection exists for excersize "${excersize}" for user with user_id "${user_id}"`);
	return res.code(200).send(entry_collection);
}