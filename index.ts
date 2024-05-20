import API from "./routes-api";

const PORT = 3000;
const express = require("express");
const app = express();
app.use(express.json());

/** API **/

app.get("/api/user/:user_id", API.get_user_by_id);
app.get("api/user/:user_id/history", API.get_user_history);
app.get("/api/user/:user_id/entries/:excersize", API.get_entry_collection);
app.post("/api/user/:user_id/entries/:excersize", API.post_entry);
app.post("/api/stats/:user_id/:excersize", API.make_graph);
app.get("/api/simplified-excersizes/:user_id", API.get_simplified_excersizes);
/** Website **/

app.get("/", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/index.html");
});

app.get("/login", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/login.html");
});

app.get("/stats", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/stats.html");
});

app.get("/history", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/history.html");
});

/** Static **/

app.get("/favicon.png", (req: any, res: any) => {
  return res.sendFile(__dirname + "/favicon.png");
});

app.get("/scripts/*", (req: any, res: any) => {
  return res.sendFile(__dirname + req.url);
});

app.get("/mdbootstrap/*", (req: any, res: any) => {
  return res.sendFile(__dirname + req.url);
});

/** Start App **/

app.listen(PORT, () => {
	console.log("\nApplication running @ http://localhost:3000");
});
