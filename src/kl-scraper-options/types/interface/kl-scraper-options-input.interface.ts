import { LoggerLevel } from '../../../logger/logger.module';

export interface KLScraperOptionsInput {
  browser?: {
    requestTimeout?: number;
    headless?: boolean;
    delayBetweenRequests?: [number, number];
  };
  log?: {
    level?: LoggerLevel;
  };
}
