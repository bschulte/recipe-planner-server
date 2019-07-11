import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { Inject } from "typedi";

import { RecipeInput } from "./dtos/RecipeInput";
import Recipe from "./recipe.entity";
import { RecipeService } from "./recipe.service";

@Resolver(Recipe)
export class RecipeResolver {
  @Inject() private recipeService: RecipeService;

  @Query(() => Recipe)
  @Authorized()
  public async recipe(@Ctx() ctx: any, @Arg("id") id: number) {
    return this.recipeService.findOneById(id);
  }

  @Query(() => [Recipe])
  @Authorized()
  public async recipes() {
    return this.recipeService.findAll();
  }

  @Mutation(() => Recipe)
  @Authorized()
  public async createRecipe(
    @Arg("recipeInput") recipeInput: RecipeInput,
    @Ctx() ctx: any
  ) {
    return this.recipeService.create(recipeInput, ctx.user.id);
  }

  @Mutation(() => Recipe)
  @Authorized()
  public async updateRecipe(
    @Arg("id") id: number,
    @Arg("recipeInput") recipeInput: RecipeInput
  ) {
    return this.recipeService.update(id, recipeInput);
  }
}
