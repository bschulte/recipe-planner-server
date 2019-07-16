import {
  JsonController,
  Post,
  UploadedFile,
  Ctx,
  Authorized
} from "routing-controllers";
import { Inject } from "typedi";

import { Logger } from "../../logging/Logger";
import { ImporterService } from "./importer.service";

@JsonController("/importer")
@Authorized()
export class ImporterController {
  private logger = new Logger(ImporterController.name);
  @Inject() private importerService: ImporterService;

  @Post("/chrome-bookmarks")
  public importRecipesFromChromeBookmarks(
    @UploadedFile("bookmarks", { required: true }) bookmarksFile: any,
    @Ctx() ctx: any
  ) {
    this.logger.debug("Importing recipes from Chrome bookmarks");

    this.importerService.importBookmarksFromChrome(
      bookmarksFile,
      ctx.state.user.id
    );

    return { success: true };
  }
}
