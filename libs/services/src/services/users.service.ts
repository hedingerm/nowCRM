import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { User, Form_User } from "../types/user";
import BaseService from "./common/base.service";

class UsersService extends BaseService<User, Form_User> {
  public constructor() {
    super(API_ROUTES_STRAPI.USERS);
  }
}

export const usersService = new UsersService();


