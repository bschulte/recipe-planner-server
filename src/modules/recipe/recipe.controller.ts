import { Context } from "koa";
import {
  JsonController,
  Post,
  BodyParam,
  Ctx,
  Get,
  Put,
  Param,
  Body
} from "routing-controllers";
import { Inject } from "typedi";

import { StatusCode } from "../../common/constants";
import { Logger } from "../../logging/Logger";
import { RecipeService } from "./recipe.service";
import { RecipeInput } from "./dtos/RecipeInput";

@JsonController("/recipe")
export class RecipeController {
  private logger = new Logger(RecipeController.name);
  @Inject() private recipeService: RecipeService;

  @Get("/:id")
  public async getRecipe(@Param("id") id: number) {
    return await this.recipeService.findOneById(id);
  }

  @Post("/")
  public async createRecipe(
    @Body() recipeInput: RecipeInput,
    @Ctx() ctx: Context
  ) {
    await this.recipeService.create(recipeInput);

    ctx.status = StatusCode.ACCEPTED;
    return { success: true };
  }

  @Put("/:id")
  public async updateRecipe(
    @Body() recipeInput: RecipeInput,
    @Param("id") id: number,
    @Ctx() ctx: Context
  ) {
    await this.recipeService.update(
      id,
      recipeInput
    );

    ctx.status = StatusCode.ACCEPTED;
    return { success: true };
  }
}
