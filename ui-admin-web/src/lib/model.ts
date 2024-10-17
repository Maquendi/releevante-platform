export interface ApiRequest {
    resource: string;
    body?: object;
    queryParams?: Map<string, string|number>
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
}


export async function buildRequest(resource: string, body: object, params?: Map<string, string|number>): Promise<ApiRequest> {
    return new Promise<ApiRequest>((resolve) => {
        resolve({
            resource,
            body,
            queryParams: params
        });
      });
}