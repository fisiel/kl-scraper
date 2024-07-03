import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { KLScraper, KLScraperOptionsProvider } from './index';
import { KLScraperScrapConfigProvider } from './kl-scraper-scrap-config/kl-scraper-scrap-config.provider';

const klScraperOptions = KLScraperOptionsProvider.getFromEnv();

const { outputDir, recipesPerFile, startCursor } = KLScraperScrapConfigProvider.provide();

const scrapSessionId = Date.now();

(async () => {
  await mkdir(outputDir, { recursive: true });

  const klScraper = await new KLScraper().init(klScraperOptions);

  let cursor = startCursor;

  do {
    const paginatedRecipes = await klScraper.scrapPaginated(startCursor, recipesPerFile);

    await writeFile(
      path.join(outputDir, `${scrapSessionId}-${cursor}-${paginatedRecipes.nextCursor}.json`),
      JSON.stringify(paginatedRecipes, null, 2),
    );

    cursor = paginatedRecipes.nextCursor;
  } while (cursor !== 1);

  await klScraper.close();
})();
