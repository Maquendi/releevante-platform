import { ApiRequest } from "./model";
require("dotenv").config();

const API_SERVER_URL = `${process.env.SERVER_URL}/api`;

export function buildRequestUrl(request: ApiRequest) {
  let resourceUrl = `${request.resource}`;
  request.queryParams?.entries().map((key, value) => {
    resourceUrl = `${resourceUrl}/?${key}=${value}`;
  });
  return `${API_SERVER_URL}/${resourceUrl}`;
}

export function buildHttpHeaders(request: ApiRequest) {
  if (request.token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${request.token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
}
