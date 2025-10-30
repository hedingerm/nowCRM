import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Organization, Form_Organization } from "../types/organization";
import BaseService from "./common/base.service";

class OrganizationsService extends BaseService<Organization, Form_Organization> {
  public constructor() {
    super(API_ROUTES_STRAPI.ORGANIZATIONS);
  }
}

export const organizationsService = new OrganizationsService();


