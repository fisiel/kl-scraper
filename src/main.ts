import { KLScraper } from './index';

(async () => {
  const klScraper = await new KLScraper().init();

  await klScraper.scrap();

  await klScraper.close();
})();
