import { request } from "@playwright/test";
import { logger } from "../utils/logger";
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
  });
  logger.info(`POST request completed: ${url}`);
  logger.info(`Response status: ${response.status()}`);
  return response;
}
