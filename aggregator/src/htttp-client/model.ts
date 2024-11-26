export interface ApiRequest {
  resource: string;
  body?: object;
  queryParams?: Map<string, string | number>;
}

export interface ApiResponse<T> {
  statusCode: number;
  context: {
    data: T;
  };
}