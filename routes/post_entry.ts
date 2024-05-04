import Database from "../database";
import { Excersizes } from "../types";
import { TExcersize, UserID } from "../types";
import Validate from "../validate";

export default function post_entry(req: any, res: any): void {
  const user_id = req.params.user_id;
  const excersize = req.params.excersize;

  if (Database.GetUser(user_id) === null)
    return res.status(400).send({ success: false, error: `User with user_id "${user_id}" does not exist` });

  if (!Excersizes.includes(excersize))
    return res.status(400).send({ success: false, error: `Excersize "${excersize}" does not exist` });

  const reps = req.body?.reps;
  const weight = req.body?.weight;

  if (Validate(user_id, res)) return;
  if (Validate(excersize, res)) return;
  if (Validate(reps, res)) return;
  if (Validate(weight, res)) return;

  Database.AddEntry(user_id as UserID, excersize as TExcersize, reps, weight);
  return res.status(200).send({ success: true });
}