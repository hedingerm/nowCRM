import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { SearchHistory, Form_SearchHistory } from "../types/search-history";
import BaseService from "./common/base.service";

class SearchHistoriesService extends BaseService<SearchHistory, Form_SearchHistory> {
  public constructor() {
    super(API_ROUTES_STRAPI.SEARCH_HISTORIES);
  }
}

export const searchHistoriesService = new SearchHistoriesService();


