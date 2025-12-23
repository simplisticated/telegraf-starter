import BotModel from "./bot";
import LogModel from "./log";
import SessionModel from "./session";
import TelegramProfileModel from "./telegram-profile";
import UserModel from "./user";

const DATABASE_MODELS = [
    UserModel,
    BotModel,
    SessionModel,
    TelegramProfileModel,
    LogModel,
];

export default DATABASE_MODELS;
