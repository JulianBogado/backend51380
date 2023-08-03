import { UserModel } from "./models/user.model";

export default class Users {
  constructor() {}

  get = async () => {
    const users = await UserModel.find();
    return users;
  };

  insert = async (data) => {
    const result = await UserModel.create(data);
    return result;
  };



}
