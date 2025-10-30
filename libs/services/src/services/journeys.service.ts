import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Journey, Form_Journey } from "../types/journey";
import BaseService from "./common/base.service";

class JourneysService extends BaseService<Journey, Form_Journey> {
  public constructor() {
    super(API_ROUTES_STRAPI.JOURNEYS);
  }
}

export const journeysService = new JourneysService();



