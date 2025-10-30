import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Composition, Form_Composition } from "../types/composition";
import BaseService from "./common/base.service";

class CompositionsService extends BaseService<Composition, Form_Composition> {
  public constructor() {
    super(API_ROUTES_STRAPI.COMPOSITIONS);
  }
}

export const compositionsService = new CompositionsService();



