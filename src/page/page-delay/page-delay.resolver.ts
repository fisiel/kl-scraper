import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';
import {
  DEFAULT_DELAY_BETWEEN_REQUESTS_BASE,
  DEFAULT_DELAY_BETWEEN_REQUESTS_MAX_RANDOM,
} from './constant';
import { DelayBetweenRequests } from './types/type/delay-between-requests.type';

export class PageDelayResolver {
  private readonly logger: Logger;

  private readonly base: number;
  private readonly randomMax: number;

  constructor(
    loggerProvider: LoggerProvider,
    delayBetweenRequests: DelayBetweenRequests = [undefined, undefined],
  ) {
    this.logger = loggerProvider.provide(PageDelayResolver.name);

    this.base = delayBetweenRequests[0] ?? DEFAULT_DELAY_BETWEEN_REQUESTS_BASE;
    this.randomMax = delayBetweenRequests[1] ?? DEFAULT_DELAY_BETWEEN_REQUESTS_MAX_RANDOM;
  }

  public resolve(): number {
    const delay = this.base + Math.floor(Math.random() * this.randomMax);

    this.logger.silly(`Delay: ${delay}`);

    return delay;
  }
}
