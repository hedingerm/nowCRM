import { Campaign } from "./campaign";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { StrapiConnect } from "./common/StrapiQuery";
import { Contact } from "./contact";
import { JourneyPassedStep } from "./journey-passed-step";
import { JourneyStep } from "./journey-step";
export interface Journey extends BaseType {
    campaign: Campaign;
    contacts: Contact[];
    flow: object;
    active: boolean;
    journey_passed_steps: JourneyPassedStep[];
    journey_steps: JourneyStep[]
}

export interface Form_Journey extends BaseFormType {
    campaign: DocumentId;
    contacts: StrapiConnect;
    flow: object;
    active: boolean;
    journey_passed_steps: StrapiConnect;
    journey_steps: StrapiConnect
}
