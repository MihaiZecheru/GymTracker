import Database from "../database";
import Validate from "../validate";

export default function get_user_by_id(req: any, res: any): void {
	const user_id = req.params?.user_id;
	if (Validate(user_id, "user_id", res)) return;
	const user = Database.GetUser(user_id);
	if (user === null) return res.status(400).send(`User with user_id "{user_id}" does not exist.`)
	return res.status(200).send(user);
}