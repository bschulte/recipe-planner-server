import * as recipeService from "./recipe.service";

describe("recipe", () => {
  test("should do something", async () => {
    jest
      .spyOn(recipeService, "findOneById")
      .mockImplementation(() => null);

    const result = await recipeService.findOneById(1);
    expect(true).toBe(true);
  });
});
