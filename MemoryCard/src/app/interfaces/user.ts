import { Folder } from "./folder";

export interface User {
    _id: String;
    username: String;
    email: String;
    password: String;
    school: String;
    city: String;
    FavoriteFolder: [string];
}
