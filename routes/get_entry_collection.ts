import { IEntryCollection } from "../database-types";
import Database from "../database";
import Validate from "../validate";

export default async function get_entry_collection(req: any, res: any): Promise<void> {
	const user_id = req.params?.id;
	const excersize = req.params?.excersize;

	if (Validate(user_id, "user_id", res)) return;
	if (Validate(excersize, "excersize", res)) return;

	const entry_collection: IEntryCollection = await Database.GetEntryCollection(user_id, excersize);
	if (entry_collection === null) return res.status(400).send(`No entry collection exists for excersize "${excersize}" for user with user_id "${user_id}"`);
	return res.status(200).send(entry_collection);
}