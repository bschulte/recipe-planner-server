import * as importerService from "./importer.service";

describe("importer", () => {
  test("should do something", async () => {
    jest
      .spyOn(importerService, "findOneById")
      .mockImplementation(() => null);

    const result = await importerService.findOneById(1);
    expect(true).toBe(true);
  });
});
