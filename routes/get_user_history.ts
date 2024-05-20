import Database from "../database";
import { IEntry, IEntryCollection } from "../database-types";

export default function get_user_history(req: any, res: any): void {
  const user_id = req.params.user_id;

  if (Database.GetUser(user_id) === null)
    return res.status(400).send({ success: false, error: `User with user_id "${user_id}" does not exist` });

  Database.GetAllEntryCollections(user_id).then(async (entry_collections: Array<IEntryCollection>) => {
    if (!entry_collections) {
      return res.status(400).send({ error: `No entry collection exists for user with user_id "${user_id}"` });
    }

    const history: Array<{ excersize: string, entries: Array<IEntry> }> = [];
    for (const entry_collection of entry_collections) {
      const entries = await Database.GetEntriesWithIDs(entry_collection.entries);
      history.push({ excersize: entry_collection.excersize, entries });
    }

    return res.send({ history });
  });
}