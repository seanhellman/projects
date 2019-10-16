import { combineReducers } from "redux";
import view from "./view"
import food from "./food";
import chat from './chat'
import login from "./login";
import user from "./user"
import exercise from "./exercise";

export default combineReducers({ view, food, chat, login, user, exercise });
