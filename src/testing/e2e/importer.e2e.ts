import createTestClient from "../utils/mock-apollo";
import { bootstrap, reloadMockData } from "../../bootstrap-db";
import { getConnection } from "typeorm";
import * as importerService from "../../modules/importer/importer.service";

describe("importer resolver e2e", () => {
  let testClient;

  beforeEach(async () => {
    await bootstrap();
    await reloadMockData();
    testClient = await createTestClient();
  });

  afterEach(async () => {
    await getConnection().close();
  });

  test("something should happen", async () => {
    expect(true).toBe(true);
  });
});
