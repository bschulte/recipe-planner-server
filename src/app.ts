import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import path from "path";
import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import serve from "koa-static";
import morgan from "koa-morgan";
import als from "async-local-storage";
import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-koa";
import { Container } from "typedi";
import {
  useContainer as routingUseContainer,
  useKoaServer,
  Action
} from "routing-controllers";
import {
  buildSchemaSync,
  useContainer as graphqlUseContainer
} from "type-graphql";

import User from "./modules/user/user.entity";
import { authChecker } from "./security/auth-checker";
import { Logger } from "./logging/Logger";
import { isDevEnv } from "./common/helpers/util";
import { UserService } from "./modules/user/user.service";

const { APP_KEY = "super secret" } = process.env;

const GRAPHQL_PATH = "/graphql";

const createApp = async () => {
  const _logger = new Logger("App.ts");

  // Use DI for resolvers
  graphqlUseContainer(Container);
  const schema = buildSchemaSync({
    resolvers: [`${__dirname}/**/*.resolver.ts`],
    authChecker,
    dateScalarMode: "timestamp"
  });

  // Create the server with the routing controllers function in
  // order to feed in all our controllers
  const app = new Koa();

  // Use bodyparser for body parameters being sent
  app.use(bodyParser());

  // Enable the async local storage for the application
  als.enable();

  // Set the unique identifier for each request
  app.use(async (ctx: Context, next: any) => {
    const requestId = ctx.request.headers["x-request-id"] || uuid();
    als.set("requestId", requestId.replace("-", "").slice(0, 12));

    await next();
  });

  // Setup JWT authentication for everything
  // Also set the logged in user in async local storage
  app.use(jwt({ secret: APP_KEY, passthrough: true }));
  app.use(async (ctx: Context, next: any) => {
    if (ctx.state.user) {
      als.set("user", ctx.state.user.email);
    }

    await next();
  });

  // Use DI for controllers
  routingUseContainer(Container);
  useKoaServer(app, {
    controllers: [`${__dirname}/modules/**/*.controller.ts`],
    authorizationChecker: async (action: Action, roles: string[]) => {
      return await authChecker(action, roles);
    }
  });

  // Global exception handler
  app.use(async (ctx: Context, next: any) => {
    try {
      await next();
    } catch (err) {
      console.log("Caught error:");
      console.log(err);
      ctx.throw(err.message, err.status);
    }
  });

  // Static files
  app.use(serve(path.join(__dirname, "..", "public")));

  // Morgan logger for requests
  app.use(morgan("short", { stream: _logger }));

  // Apollo server
  const userService = Container.get(UserService);
  const server = new ApolloServer({
    schema,
    context: async ({ ctx }: { ctx: Context & { user: User } }) => {
      if (ctx.state.user) {
        const user = await userService.findOneById(ctx.state.user.id);
        return { ctx, user };
      }
      return { ctx, user: null };
    },
    playground: isDevEnv()
  });

  // Apply GraphQL middleware to the express app
  server.applyMiddleware({ app, path: GRAPHQL_PATH });

  return app;
};

export default createApp;
