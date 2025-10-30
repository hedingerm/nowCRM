import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { List, Form_List } from "../types/list";
import BaseService from "./common/base.service";

class ListsService extends BaseService<List, Form_List> {
  public constructor() {
    super(API_ROUTES_STRAPI.LISTS);
  }
}

export const listsService = new ListsService();


