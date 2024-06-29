import { LoggerLevel } from '../../../logger/logger.module';

export interface KLScraperOptions {
  browser: {
    requestTimeout: number;
    headless: boolean;
    delayBetweenRequests: [number, number];
  };
  log: {
    level: LoggerLevel;
  };
}
