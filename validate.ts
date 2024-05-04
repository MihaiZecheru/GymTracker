/**
 * Assert that the given <value> exists, otherwise return a 400 response
 * @param value The value to check. Assert that the user has provided this value
 * @param res The response object to send the response with from the express API
 * @returns True if the response object was resolved, false otherwise
 */
export default function Validate(value: string, res: any): boolean {
	// if first_name = "john", this will give "first_name"
	const var_name = Object.keys({value})[0];

	if (value === null || value === undefined) {
		res.code(400).send(`${var_name} param / body value is missing`);
    return true;
	}

  return false;
}