import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Keyword, Form_Keyword } from "../types/keyword";
import BaseService from "./common/base.service";

class KeywordsService extends BaseService<Keyword, Form_Keyword> {
  public constructor() {
    super(API_ROUTES_STRAPI.KEYWORDS);
  }
}

export const keywordsService = new KeywordsService();


