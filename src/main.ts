import { KLScraper, KLScraperOptionsProvider } from './index';

const klScraperOptions = KLScraperOptionsProvider.getFromEnv();

(async () => {
  const klScraper = await new KLScraper().init(klScraperOptions);

  await klScraper.scrapPaginated(1, 10);

  await klScraper.close();
})();
