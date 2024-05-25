const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function format_date(date: number) {
  const date_info = new Date(date).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" }).split('/');
  const day = date_info[1];
  const month = months[parseInt(date_info[0]) - 1];
  const year = date_info[2];
  const weekday = weekdays[new Date(date_info.join("/")).getDay()];
  return `${weekday}, ${month} ${day}, ${year}`;
}