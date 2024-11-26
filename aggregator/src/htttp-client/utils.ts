import { ApiRequest } from "./model";
require('dotenv').config();

const API_SERVER_URL = `${process.env.SERVER_URL}/api`;

const AUTH_API_KEY = process.env.API_KEY;

export function buildRequestUrl(request: ApiRequest) {
  let resourceUrl = `${request.resource}`;
  request.queryParams?.entries().map((key, value) => {
    resourceUrl = `${resourceUrl}/?${key}=${value}`;
  });
  return `${API_SERVER_URL}/${resourceUrl}`;
}

export function buildHttpHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": AUTH_API_KEY,
  };
}