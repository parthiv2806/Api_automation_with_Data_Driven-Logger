import { request } from "@playwright/test";
import { logger } from "../utils/logger";
import { getToken } from "../utils/tokenmanager";

let apicontext = null;

export async function initApiClient() {
  apicontext = await request.newContext({});
}

export async function get(url) {
  return await apicontext.get(url);
}

export async function post(url, data) {
  logger.info(`POST request started: ${url}`);
  const response = await apicontext.post(url, {
    data: data,
    headers: { Cookie: `token=${getToken()}` },
  });
  logger.info(`POST request completed: ${url}`);
  logger.info(`Response status: ${response.status()}`);
  return response;
}

export async function patch(url, data) {
  logger.info(`PATCH request started: ${url}`);
  const response = await apicontext.patch(url, {
    data: data,
    headers: { Cookie: `token=${getToken()}` },
  });
  logger.info(`PATCH request completed: ${url}`);
  logger.info(`Response status: ${response.status()}`);
  return response;
}

export async function put(url, data) {
  logger.info(`PUT request started: ${url}`);
  const response = await apicontext.put(url, {
    data: data,
    headers: { Cookie: `token=${getToken()}` },
  });
  logger.info(`PUT request completed: ${url}`);
  logger.info(`Response status: ${response.status()}`);
  return response;
}
