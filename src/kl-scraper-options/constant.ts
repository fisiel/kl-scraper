import { LoggerLevel } from '../logger/logger.module';

export const DEFAULT_BROWSER_REQUEST_TIMEOUT = 600000; // 10m * 60s * 1000ms
export const DEFAULT_BROWSER_HEADLESS = true;
export const DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_BASE = 5000; // 5s * 1000ms
export const DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_MAX_RANDOM = 2000; // 2s * 1000ms

export const DEFAULT_LOG_LEVEL = LoggerLevel.NONE;

export const DEFAULT_RECIPES_PER_PAGE = 50;
