import { BookCompartment } from "@/book/domain/models";
import { BridgeIoApiClient } from "../application/service.definition";

export class DefaultBridgeIoApiClient implements BridgeIoApiClient {
  async openCompartments(comparments: BookCompartment[]): Promise<any> {
    console.log(comparments)
    return {};
  }
}
 