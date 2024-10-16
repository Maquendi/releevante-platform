import { ApiRequest } from "./model";

const API_SERVER_URL = `${process.env.SERVER_URL}/api`;


function buildRequestUrl(request: ApiRequest) {
    let resourceUrl = `${request.resource}`
    request.queryParams?.entries().map((key, value)=> {
        resourceUrl = `${resourceUrl}/?${key}=${value}`
    });
    return `${API_SERVER_URL}/${resourceUrl}`;
}


export async function executeGet<T>(request: ApiRequest): Promise<T> {
    const requestUrl = buildRequestUrl(request)
    return fetch(requestUrl, {}).then();
}


export async function executePost<T>(request: ApiRequest): Promise<T> {
    const requestUrl = buildRequestUrl(request);
    return fetch(requestUrl, {}).then();
}

export async function executePut<T>(request: ApiRequest): Promise<T> {
    const requestUrl = buildRequestUrl(request);
    return fetch(requestUrl, {}).then();
}

export async function executePatch<T>(request: ApiRequest): Promise<T> {
    const requestUrl = buildRequestUrl(request);
    return fetch(requestUrl, {}).then();
}

