import { executePut } from "../htttp-client/http-client";
import { ApiRequest } from "../htttp-client/model";

const slid = process.env.slid;
export const markLibrarySynchronized = async () => {
  const request: ApiRequest = {
    resource: `aggregator/${slid}/synchronize`,
  };

  const response = await executePut<boolean>(request);

  console.log('data is synchronized: ' + response.context.data)
};
