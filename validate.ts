/**
 * Assert that the given <value> exists, otherwise return a 400 response
 * @param value The value to check. Assert that the user has provided this value
 * @param res The response object to send the response with from the express API
 * @returns True if the response object was resolved, false otherwise
 */
export default function Validate(value: string, var_name: string, res: any): boolean {
	if (value === null || value === undefined) {
		res.status(400).send(`${var_name} param / body value is missing`);
    return true;
	}

  return false;
}