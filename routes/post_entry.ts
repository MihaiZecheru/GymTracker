import Database from "../database";
import { Excersizes } from "../types";
import { TExcersize, UserID } from "../types";
import Validate from "../validate";

function isInteger(str: string): boolean {
  return /^[+-]?\d+$/.test(str);
}

function isNumber(str: string): boolean {
  return !isNaN(parseFloat(str));
}

export default function post_entry(req: any, res: any): void {
  const user_id = req.params.user_id;
  const excersize = req.params.excersize;

  if (Database.GetUser(user_id) === null)
    return res.status(400).send({ success: false, error: `User with user_id "${user_id}" does not exist` });

  if (!Excersizes.includes(excersize))
    return res.status(400).send({ success: false, error: `Excersize "${excersize}" does not exist` });

  const reps = req.body?.reps;
  const weight = req.body?.weight;

  if (Validate(user_id, "user_id", res)) return;
  if (Validate(excersize, "excersize", res)) return;
  if (Validate(reps, "reps", res)) return;
  if (Validate(weight, "weight", res)) return;

  if (!isInteger(reps)) return res.status(400).send({ success: false, error: `"Reps" field must be an integer` });
  if (!isInteger(weight) && !isNumber(weight)) return res.status(400).send({ success: false, error: `"Weight" field must be an integer or float` });

  Database.AddEntry(user_id as UserID, excersize as TExcersize, parseInt(reps), parseFloat(weight));
  return res.status(200).send({ success: true });
}