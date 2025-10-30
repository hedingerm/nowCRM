import { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { StrapiConnect } from "./common/StrapiQuery";
import { Composition } from "./composition";
import { Contact } from "./contact";
import { Identity } from "./identity";
import { Journey } from "./journey";
import { JourneyPassedStep } from "./journey-passed-step";
import { JourneyStepConnection } from "./journey-step-connection";

export type JourneyStepTypes = "trigger"
| "scheduler-trigger"
| "channel"
| "wait"

export interface JourneyStep extends BaseType {
    contacts: Contact[]
    joruney: Journey;
    channel: Channel;
    journey_passed_steps: JourneyPassedStep[];
    connections_to_this_step: JourneyStepConnection[];
    connections_from_this_step: JourneyStepConnection[];
    identity: Identity;
    additional_data: object;
    type: JourneyStepTypes
    composition: Composition
}

export interface Form_JourneyStep extends BaseFormType {
    contacts: StrapiConnect
    joruney: DocumentId;
    channel: DocumentId;
    journey_passed_steps: StrapiConnect;
    connections_to_this_step: StrapiConnect;
    connections_from_this_step: StrapiConnect;
    identity: DocumentId;
    additional_data: object;
    type: JourneyStepTypes
    composition: DocumentId
}
