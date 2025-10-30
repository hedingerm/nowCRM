import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Contact, Form_Contact } from "../types/contact";
import BaseService from "./common/base.service";

class ContactsService extends BaseService<Contact, Form_Contact> {
  public constructor() {
    super(API_ROUTES_STRAPI.CONTACTS);
  }
}

export const contactsService = new ContactsService();



