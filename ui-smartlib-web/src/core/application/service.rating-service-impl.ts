import { ServiceRepository } from "../domain/repositories";
import { Rating } from "../domain/service-rating.model";

export class ServiceRatingService implements ServiceRatingService{
    constructor(private serviceRepository: ServiceRepository) {}
    async saveServiceReview(rating:Rating): Promise<Rating[]> {
      return this.serviceRepository.saveServiceReview(rating)
    }
  }
  