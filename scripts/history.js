export async function get_history(user_id) {
  return fetch(`/api/user/${user_id}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => data.history)
}
