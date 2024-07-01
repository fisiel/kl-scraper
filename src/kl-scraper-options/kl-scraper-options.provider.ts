import { DEFAULT_LOG_LEVEL } from '../logger/constant';
import { DEFAULT_REQUEST_TIMEOUT } from '../page/constant';
import {
  DEFAULT_DELAY_BETWEEN_REQUESTS_BASE,
  DEFAULT_DELAY_BETWEEN_REQUESTS_MAX_RANDOM,
} from '../page/page-delay/constant';
import { DEFAULT_BROWSER_HEADLESS } from './constant';
import { KLScraperOptionsEnvVariable } from './types/enum/kl-scraper-options-env-variable.enum';
import { KLScraperOptionsProviderOutput } from './types/interface/kl-scraper-options-provider-output.interface';
import { KLScraperOptions } from './types/interface/kl-scraper-options.interface';

export class KLScraperOptionsProvider {
  provide(klScraperOptions?: KLScraperOptions): KLScraperOptionsProviderOutput {
    const browser = {
      requestTimeout: klScraperOptions?.browser?.requestTimeout ?? DEFAULT_REQUEST_TIMEOUT,
      headless: klScraperOptions?.browser?.headless ?? DEFAULT_BROWSER_HEADLESS,
      delayBetweenRequests: klScraperOptions?.browser?.delayBetweenRequests ?? [
        DEFAULT_DELAY_BETWEEN_REQUESTS_BASE,
        DEFAULT_DELAY_BETWEEN_REQUESTS_MAX_RANDOM,
      ],
    };

    const log = {
      level: klScraperOptions?.log?.level ?? DEFAULT_LOG_LEVEL,
      dir: klScraperOptions?.log?.dir,
    };

    return { browser, log };
  }

  static getFromEnv(): KLScraperOptions {
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
          ? parseInt(process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_LOG_LEVEL], 10)
          : undefined,
        dir: process.env[KLScraperOptionsEnvVariable.KL_SCRAPER_LOG_DIR],
      },
    };
  }
}
