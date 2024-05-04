import API from "./routes-api";
import { MakeID } from "./types";

const PORT = 3000;
const express = require("express");
const app = express();
express.json();

/** API **/

app.get("/api/user/:user_id", API.get_user_by_id);
app.get("/api/user/:user_id/entries/:excersize", API.get_entry_collection);
app.post("/api/user/:user_id/entries/:excersize", API.post_entry);

/** Website **/

app.get("/", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/index.html");
});

app.get("/login", (req: any, res: any) => {
  return res.sendFile(__dirname + "/pages/login.html");
});

/** Static **/

app.get("/favicon.ico", (req: any, res: any) => {
  return res.sendFile(__dirname + "/favicon.ico");
});

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
