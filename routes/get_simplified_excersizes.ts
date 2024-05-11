import Database from "../database";
import { IEntryCollection } from "../database-types";
import Validate from "../validate";

export default function get_simplified_excersizes(req: any, res: any): void {
  const user_id = req.params?.user_id;

  if (Validate(user_id, "user_id", res)) return;

  const user = Database.GetUser(user_id);
  if (user === null) return res.status(400).send({ error: `User with user_id "${user_id}" does not exist.` });

  Database.GetAllEntryCollections(user_id).then((entry_collections: Array<IEntryCollection>) => {
    if (!entry_collections) {
      return res.status(400).send({ error: `No entry collection exists for user with user_id "${user_id}"` });
    }

    const excersizes: Array<string> = entry_collections.map((entry_collection: IEntryCollection) => entry_collection.excersize);
    return res.send({ excersizes });
  });
}