import { ServiceRepository, SettingsRepository } from "../domain/repositories";
import { db } from "@/config/drizzle/db";
import { Rating } from "../domain/service-rating.model";
import { serviceRatingsSchema } from "@/config/drizzle/schemas/serviceRating";

class ServiceRepositoryImpl implements ServiceRepository {
  async saveServiceReview(bookReview: Rating): Promise<Rating[]> {
    return db
      .insert(serviceRatingsSchema)
      .values(bookReview)
      .returning() as Promise<Rating[]>;
  }
}

export const defaultServiceRepository = new ServiceRepositoryImpl();
