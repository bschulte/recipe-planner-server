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
}
