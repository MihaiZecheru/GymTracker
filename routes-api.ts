import get_entry_collection from "./routes/get_entry_collection";
import get_user_by_id from "./routes/get_user_by_id";
import post_entry from "./routes/post_entry";
import make_graph from "./routes/make_graph";
import get_simplified_excersizes from "./routes/get_simplified_excersizes";
import get_user_history from "./routes/get_user_history";

const API = {
  get_user_by_id,
  get_entry_collection,
  post_entry,
  make_graph,
  get_simplified_excersizes,
  get_user_history
}

export default API;