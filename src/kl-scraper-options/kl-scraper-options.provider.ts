import { LoggerLevel } from '../logger/logger.module';
import {
  DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_BASE,
  DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_MAX_RANDOM,
  DEFAULT_BROWSER_HEADLESS,
  DEFAULT_BROWSER_REQUEST_TIMEOUT,
  DEFAULT_LOG_LEVEL,
} from './constant';
import { KLScraperOptionsEnvVariable } from './types/enum/kl-scraper-options-env-variable.enum';
import { KLScraperOptionsInput } from './types/interface/kl-scraper-options-input.interface';
import { KLScraperOptions } from './types/interface/kl-scraper-options.interface';

export class KLScraperOptionsProvider {
  public provide(klScraperOptions?: KLScraperOptionsInput): KLScraperOptions {
    if (!klScraperOptions) {
      klScraperOptions = this.getFromEnv();
    }

    const { browser, log } = klScraperOptions;

    return {
      browser: {
        requestTimeout: browser?.requestTimeout ?? DEFAULT_BROWSER_REQUEST_TIMEOUT,
        headless: browser?.headless ?? DEFAULT_BROWSER_HEADLESS,
        delayBetweenRequests: browser?.delayBetweenRequests ?? [
          DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_BASE,
          DEFAULT_BROWSER_DELAY_BETWEEN_REQUESTS_MAX_RANDOM,
        ],
      },
      log: {
        level: log?.level ?? DEFAULT_LOG_LEVEL,
      },
    };
  }

  private getFromEnv(): KLScraperOptionsInput {
    return {
      browser: {
        requestTimeout: process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_REQUEST_TIMEOUT]
          ? parseInt(
              process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_REQUEST_TIMEOUT],
              10,
            )
          : undefined,
        headless: process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_HEADLESS]
          ? Boolean(
              parseInt(process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_HEADLESS], 10),
            )
          : undefined,
        delayBetweenRequests: process.env[
          KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_DELAY_BETWEEN_REQUESTS
        ]
          ? (process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_BROWSER_DELAY_BETWEEN_REQUESTS]
              .split('|')
              .map((value) => parseInt(value, 10)) as [number, number])
          : undefined,
      },
      log: {
        level: process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_LOG_LEVEL]
          ? (parseInt(
              process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_LOG_LEVEL],
              10,
            ) as LoggerLevel)
          : undefined,
      },
    };
  }
}
