import { Form_JourneyPassedStep, JourneyPassedStep } from "types/journey-passed-step";
import BaseService from "./common/base.service";
import API_ROUTES_STRAPI from "api-routes/api-routes-strapi";

class JourneyPassedStepService extends BaseService<
	JourneyPassedStep,
	Form_JourneyPassedStep
> {
	public constructor() {
		super(API_ROUTES_STRAPI.JOURNEY_PASSED_STEPS);
	}
}
export const journeyPassedStepService = new JourneyPassedStepService();
