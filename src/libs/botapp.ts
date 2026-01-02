"use server";
import axios from "axios";
const BOT_APP_URL = process.env.BOT_APP_URL!;

const BotApp = axios.create({ baseURL: BOT_APP_URL });

export default BotApp;
