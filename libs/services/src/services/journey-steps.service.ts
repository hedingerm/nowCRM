import { handleError, StandardResponse } from "server";
import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Journey, Form_Journey } from "../types/journey";
import BaseService from "./common/base.service";
import { journeyPassedStepService } from "./journey-passed-step.service";

class JourneyStepsService extends BaseService<Journey, Form_Journey> {
  public constructor() {
    super(API_ROUTES_STRAPI.JOURNEY_STEPS);
  }

  async checkPassedStep(
    token: string,
    stepId: number,
    contactId: number,
    compositionId: number,
): Promise<StandardResponse<boolean>> {
    try {
        const data = await journeyPassedStepService.find(token, {
            filters: {
                journey_step: { id: { $eq: stepId } },
                composition: { id: { $eq: compositionId } },
                contact: { id: { $eq: contactId } },
            },
        });

        if (!data.data)
            return {
                data: null,
                status: data.status,
                success: false,
                errorMessage: "Could not check passed step .Probably strapi is down",
            };

        return {
            data: data.data.length > 0,
            status: data.status,
            success: data.success,
        };
    } catch (error: any) {
        return handleError(error);
    }
}
}

export const journeyStepsService = new JourneyStepsService();



