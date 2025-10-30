import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { CompositionItem, Form_CompositionItem } from "../types/composition-item";
import BaseService from "./common/base.service";

class CompositionItemsService extends BaseService<CompositionItem, Form_CompositionItem> {
  public constructor() {
    super(API_ROUTES_STRAPI.COMPOSITION_ITEM);
  }
}

export const compositionItemsService = new CompositionItemsService();



