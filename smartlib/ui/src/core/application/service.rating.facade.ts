import { Rating } from "../domain/service-rating.model";
import { ServiceRatingService } from "./service.rating-service-impl";

export class ServiceRatingFacade{
    constructor(private serviceRatingService: ServiceRatingService) {}
    async saveServiceReview(rating:Rating): Promise<Rating[]> {
      return this.serviceRatingService.saveServiceReview(rating)
    }
  }
  