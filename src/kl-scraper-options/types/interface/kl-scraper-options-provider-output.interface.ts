import { LoggerLevel } from '../../../logger/types/enum/logger-level.enum';
import { DelayBetweenRequests } from '../../../page/page-delay/types/type/delay-between-requests.type';

export interface KLScraperOptionsProviderOutput {
  browser: {
    requestTimeout: number;
    headless: boolean;
    delayBetweenRequests: DelayBetweenRequests;
  };
  log: {
    level: LoggerLevel;
    dir?: string;
  };
}
