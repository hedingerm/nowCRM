import { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { Composition } from "./composition";
import { Contact } from "./contact";
import { Journey } from "./journey";
import { JourneyStep } from "./journey-step";
export interface JourneyPassedStep extends Omit<BaseType,'name'> {
    contact: Contact
    journey: Journey
    journey_step: JourneyStep
    composition: Composition
    channel: Channel
}

export interface Form_JourneyPassedStep extends Omit<BaseFormType,'name'> {
    contact: DocumentId
    journey: DocumentId
    journey_step: DocumentId
    composition: DocumentId
    channel: DocumentId
}
