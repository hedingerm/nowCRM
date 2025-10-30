import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { FormEntity, Form_FormEntity } from "../types/form";
import BaseService from "./common/base.service";

class FormsService extends BaseService<FormEntity, Form_FormEntity> {
  public constructor() {
    super(API_ROUTES_STRAPI.FORMS);
  }
}

export const formsService = new FormsService();


