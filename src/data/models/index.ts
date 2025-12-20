import BotModel from "./bot";
import SessionModel from "./session";
import TelegramProfileModel from "./telegram-profile";
import UserModel from "./user";

const DATABASE_MODELS = [
    UserModel,
    BotModel,
    SessionModel,
    TelegramProfileModel,
];

export default DATABASE_MODELS;
