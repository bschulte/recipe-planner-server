import { Repository } from "typeorm";

import Recipe from "./recipe.entity";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { RecipeInput } from "./dtos/RecipeInput";

@Service()
export class RecipeService {
  @OrmRepository(Recipe) private repo: Repository<Recipe>;

  public async findOneById(recipeId: number) {
    return await this.repo.findOne({ id: recipeId });
  }

  public async findAll() {
    return await this.repo.find();
  }

  public async create(recipeInput: RecipeInput, userId: number) {
    const newRecipe = this.repo.create({ ...recipeInput, userId });
    await this.save(newRecipe);

    return await newRecipe;
  }

  public async createAll(recipes: Array<Partial<Recipe>>, userId: number) {
    const recipeEntries = recipes.map((recipeInfo: Partial<Recipe>) => {
      const newRecipe = new Recipe();
      newRecipe.url = recipeInfo.url;
      newRecipe.name = recipeInfo.name;
      newRecipe.userId = userId;

      return newRecipe;
    });

    return await this.repo.save(recipeEntries);
  }

  public async update(id: number, recipeInput: RecipeInput) {
    await this.repo.update(id, recipeInput);

    return await this.findOneById(id);
  }

  public async save(recipe: Recipe) {
    await this.repo.save(recipe);
    return recipe;
  }
}
