import { MINIMAL_CURSOR } from '../recipes-list-page/recipes-list-page-paginated/recipes-list-page-paginated-next-cursor/constant';
import { DEFAULT_OUTPUT_DIR, DEFAULT_RECIPES_PER_FILE } from './constant';
import { KLScraperScrapConfigEnvVariable } from './types/enum/kl-scraper-scrap-config-env-variable.enum';
import { KLScraperScrapConfig } from './types/interface/kl-scraper-scrap-config.interface';

export class KLScraperScrapConfigProvider {
  static provide(): KLScraperScrapConfig {
    return {
      outputDir:
        process.env[KLScraperScrapConfigEnvVariable.KL_SCRAPER_SCRAP_CONFIG_OUTPUT_DIR] ??
        DEFAULT_OUTPUT_DIR,
      recipesPerFile: process.env[
        KLScraperScrapConfigEnvVariable.KL_SCRAPER_SCRAP_CONFIG_RECIPES_PER_FILE
      ]
        ? parseInt(
            process.env[KLScraperScrapConfigEnvVariable.KL_SCRAPER_SCRAP_CONFIG_RECIPES_PER_FILE],
            10,
          )
        : DEFAULT_RECIPES_PER_FILE,
      startCursor: process.env[KLScraperScrapConfigEnvVariable.KL_SCRAPER_SCRAP_CONFIG_START_CURSOR]
        ? parseInt(
            process.env[KLScraperScrapConfigEnvVariable.KL_SCRAPER_SCRAP_CONFIG_START_CURSOR],
            10,
          )
        : MINIMAL_CURSOR,
    };
  }
}
