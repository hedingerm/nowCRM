import type { BaseFormType, BaseType } from "./common/base_type";
import { StrapiConnect } from "./common/StrapiQuery";
import { Contact } from "./contact";
import { Tag } from "./tag";
export interface List extends BaseType {
    contacts: Contact[];
    tags: Tag[]
}

export interface Form_List extends BaseFormType {
    contacts: StrapiConnect;
    tags: StrapiConnect;
}
