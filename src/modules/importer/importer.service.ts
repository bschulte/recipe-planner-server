import { Service, Inject } from "typedi";
import fs from "fs";
import * as cheerio from "cheerio";

import { Logger } from "../../logging/Logger";
import { RecipeService } from "../recipe/recipe.service";
import Recipe from "../recipe/recipe.entity";

@Service()
export class ImporterService {
  private logger = new Logger(ImporterService.name);
  @Inject() private recipeService: RecipeService;

  public async importBookmarksFromChrome(bookmarksFile: any, userId: number) {
    this.logger.debug(`Uploaded file size: ${bookmarksFile.size}`);

    const bookmarks = bookmarksFile.buffer.toString();
    const $ = cheerio.load(bookmarks);

    const recipes: Array<Partial<Recipe>> = [];
    $("a").each(function(i: number, ele: any) {
      recipes.push({ name: ele.children[0].data, url: ele.attribs.href });
    });

    this.logger.debug(`Saving ${recipes.length} new recipes`);

    await this.recipeService.createAll(recipes, userId);
  }
}
