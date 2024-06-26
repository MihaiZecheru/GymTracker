import Database from "../database";
import { IEntry, IEntryCollection } from "../database-types";
import { TExcersize } from "../types";
import format_date from "../format_date";

export default function get_user_history(req: any, res: any): void {
  const user_id = req.params.user_id;

  if (Database.GetUser(user_id) === null)
    return res.status(400).send({ success: false, error: `User with user_id "${user_id}" does not exist` });

  Database.GetAllEntryCollections(user_id).then(async (entry_collections: Array<IEntryCollection>) => {
    if (!entry_collections) {
      return res.status(400).send({ error: `No entry collections exist for user with user_id "${user_id}"` });
    }

    let entries: Array<{ excersize: TExcersize, reps: number, weight_per_rep: number, weight_sum: number, date: string }> = [];
    for (const entry_collection of entry_collections) {
      entries = entries.concat((await Database.GetEntriesWithIDs(entry_collection.entries)).map((entry: IEntry) => {
        return {
          excersize: entry_collection.excersize,
          reps: entry.reps,
          weight_per_rep: Number(entry.weight_per_rep.toFixed(2)),
          weight_sum: Number(entry.weight_sum.toFixed(2)),
          date: format_date(entry.date)
        };
      }));
    }

    // sort history by date
    const entries_sorted: { [date: string]: Array<{ excersize: TExcersize, reps: number, weight_per_rep: number, weight_sum: number }> } = {};
    entries.forEach((entry: { excersize: TExcersize, reps: number, weight_per_rep: number, weight_sum: number, date: string }) => {
      entries_sorted[entry.date] = entries_sorted[entry.date] || [];
      entries_sorted[entry.date].push({ excersize: entry.excersize, reps: entry.reps, weight_per_rep: entry.weight_per_rep, weight_sum: entry.weight_sum });
    });

    return res.send({ history: entries_sorted });
  });
}