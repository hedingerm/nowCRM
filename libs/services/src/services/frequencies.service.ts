import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Frequency, Form_Frequency } from "../types/frequncy";
import BaseService from "./common/base.service";

class FrequenciesService extends BaseService<Frequency, Form_Frequency> {
  public constructor() {
    super(API_ROUTES_STRAPI.FREQUENCY);
  }
}

export const frequenciesService = new FrequenciesService();


