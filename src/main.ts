import { KLScraper } from './index';
import { KLScraperOptionsProvider } from './kl-scraper-options/kl-scraper-options.module';

const klScraperOptions = KLScraperOptionsProvider.getFromEnv();

(async () => {
  const klScraper = await new KLScraper().init(klScraperOptions);

  await klScraper.scrap();

  await klScraper.close();
})();
