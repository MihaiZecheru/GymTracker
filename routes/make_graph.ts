import Database from "../database";
import { IEntry, IEntryCollection } from "../database-types";
import { EntryID } from "../types";
import Validate from "../validate";

async function make_graph_url(entries: Array<IEntry>, includeReps: boolean, includeWeight: boolean, includeWeightSum: boolean, includeComparison: boolean): Promise<string> {
  // Todo make an apex chart
  return "https://quickchart.io/apex-charts/render?config=";
}

export default function make_graph(req: any, res: any): void {
  const user_id = req.params?.user_id;
  const excersize = req.params?.excersize;
  const includeReps = req.body?.includeReps;
  const includeWeight = req.body?.includeWeight;
  const includeWeightSum = req.body?.includeWeightSum;
  const includeComparison = req.body?.includeComparison;

  if (Validate(user_id, "user_id", res)) return;
  if (Validate(excersize, "excersize", res)) return;
  if (Validate(includeReps, "includeReps", res)) return;
  if (Validate(includeWeight, "includeWeight", res)) return;
  if (Validate(includeWeightSum, "includeWeightSum", res)) return;
  if (Validate(includeComparison, "includeComparison", res)) return;

  const user = Database.GetUser(user_id);
	if (user === null) return res.status(400).send({ error: `User with user_id "${user_id}" does not exist.` });

  Database.GetEntryCollection(user_id, excersize).then((entry_collection: IEntryCollection) => {
    if (!entry_collection) {
      return res.status(400).send({ error: `No entry collection exists for excersize "${excersize}" for user with user_id "${user_id}"` });
    }

    const entry_ids: Array<EntryID> = entry_collection.entries;
    Database.GetEntriesWithIDs(entry_ids).then(async (entries: Array<IEntry>) => {
      return res.send({ graph_url: await make_graph_url(entries, includeReps, includeWeight, includeWeightSum, includeComparison) });
    });
  });
}