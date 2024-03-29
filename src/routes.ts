import { S } from "fluent-json-schema";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ModuleResponseSchema } from "./dto/moduleResponse.js";
import { PageResponseSchema } from "./dto/pageResponse.js";
import { AuthorizeRequestSchema } from "./dto/authorizeRequest.js";
import { LoginRequestSchema } from "./dto/loginRequest.js";
import { AuthResponseSchema } from "./dto/authResponse.js";
import { FilterResponseSchema } from "./dto/filterResponse.js";
import { PageRequestSchema } from "./dto/pageRequest.js";
import RedditController from "./reddit/reddit.controller.js";
import PixivController from "./pixiv/pixiv.controller.js";
import type ModuleControllerBase from "./base/base.controller.js";
import type ModuleResponse from "./dto/moduleResponse.js";
import type PageResponse from "./dto/pageResponse.js";
import type AuthorizeRequest from "./dto/authorizeRequest.js";
import type LoginRequest from "./dto/loginRequest.js";
import type AuthResponse from "./dto/authResponse.js";
import type FilterResponse from "./dto/filterResponse.js";
import type PageRequest from "./dto/pageRequest.js";
// Import any additional controllers here

// Add all modules to array
const modules = [
  RedditController,
  PixivController,

  // Add any additional controllers here
];

// Add all controllers to records
const controllers = modules.reduce((acc, Controller) => {
  acc[Controller.definition.id] = new Controller();
  return acc;
}, {} as Record<string, ModuleControllerBase>);

// Define some helpful types
const ModuleParamsSchema = S.object().prop("moduleId", S.string().required());
interface ModuleParams {
  moduleId: string;
}

const GetFiltersQueryStringSchema = S.object().prop("filter", S.string()).prop("itemId", S.string());
interface GetFiltersQueryString {
  filter: string;
  itemId: string;
}

const GetProxyQueryStringSchema = S.object().prop("uri", S.string().required()).prop("accessToken", S.string());
interface GetProxyQueryString {
  uri: string;
  accessToken?: string;
}

function configure(app: FastifyInstance): void {
  const config = app.config;

  async function getModules(req: FastifyRequest): Promise<ModuleResponse[]> {
    return modules.map((module) => ({
      ...module.definition,
      icon: `${req.protocol}://${req.hostname}${module.definition.icon}`,
    }));
  }

  async function getModuleGallery(
    req: FastifyRequest<{ Querystring: PageRequest; Params: ModuleParams }>,
    res: FastifyReply
  ): Promise<PageResponse> {
    const { moduleId } = req.params;
    const accessToken = req.headers["access-token"] as string;
    const controller = controllers[moduleId];
    return await controller.getPage({ req, res, config, params: req.query, accessToken });
  }

  async function getLogin(
    req: FastifyRequest<{ Querystring: LoginRequest; Params: ModuleParams }>,
    res: FastifyReply
  ): Promise<AuthResponse> {
    const { moduleId } = req.params;
    const controller = controllers[moduleId];
    return await controller.getLogin({ req, res, config, params: req.query });
  }

  async function getAuthorize(
    req: FastifyRequest<{ Querystring: AuthorizeRequest; Params: ModuleParams }>,
    res: FastifyReply
  ): Promise<AuthResponse> {
    const { moduleId } = req.params;
    const controller = controllers[moduleId];
    return await controller.getAuthorize({ req, res, config, params: req.query });
  }

  async function getRefresh(req: FastifyRequest<{ Params: ModuleParams }>, res: FastifyReply): Promise<AuthResponse> {
    const { moduleId } = req.params;
    const refreshToken = req.headers["refresh-token"] as string;
    const controller = controllers[moduleId];
    return await controller.getRefresh({ req, res, config, refreshToken });
  }

  // TODO: Split this into two endpoints
  async function getFilters(
    req: FastifyRequest<{ Querystring: GetFiltersQueryString; Params: ModuleParams }>,
    res: FastifyReply
  ): Promise<FilterResponse[]> {
    const { moduleId } = req.params;
    const accessToken = req.headers["access-token"] as string;
    const controller = controllers[moduleId];
    return await controller.getFilters({
      req,
      res,
      config,
      accessToken,
      filter: req.query.filter,
      itemId: req.query.itemId,
    });
  }

  function getProxy(
    req: FastifyRequest<{ Querystring: GetProxyQueryString; Params: ModuleParams }>,
    res: FastifyReply
  ): void {
    const { moduleId } = req.params;
    const controller = controllers[moduleId];

    controller.getProxy({ req, res, config, uri: req.query.uri, accessToken: req.query.accessToken });
  }

  // GET / - Fetches all modules
  app.get(
    "/",
    {
      schema: {
        response: { 200: S.array().items(ModuleResponseSchema) },
      },
    },
    getModules
  );

  // GET /gallery/:moduleId - Fetches content for module
  app.get(
    "/gallery/:moduleId",
    {
      schema: {
        querystring: PageRequestSchema,
        params: ModuleParamsSchema,
        response: { 200: PageResponseSchema },
      },
    },
    getModuleGallery
  );

  // GET /login/:moduleId - Authenticates user using basic auth
  app.get(
    "/login/:moduleId",
    {
      schema: {
        querystring: LoginRequestSchema,
        params: ModuleParamsSchema,
        response: { 200: AuthResponseSchema },
      },
    },
    getLogin
  );

  // GET /authorize/:moduleId - Authenticates user using OAuth
  app.get(
    "/authorize/:moduleId",
    {
      schema: {
        querystring: AuthorizeRequestSchema,
        params: ModuleParamsSchema,
        response: { 200: AuthResponseSchema },
      },
    },
    getAuthorize
  );

  // GET /refresh/:moduleId - Refreshes users auth token
  app.get(
    "/refresh/:moduleId",
    {
      schema: {
        params: ModuleParamsSchema,
        response: { 200: AuthResponseSchema },
      },
    },
    getRefresh
  );

  // GET /filters/:moduleId - Fetches filters (tags)
  app.get(
    "/filters/:moduleId",
    {
      schema: {
        querystring: GetFiltersQueryStringSchema,
        params: ModuleParamsSchema,
        response: { 200: S.array().items(FilterResponseSchema) },
      },
    },
    getFilters
  );

  // GET /proxy/:moduleId - Proxies a request to the remote resource
  app.get(
    "/proxy/:moduleId",
    {
      schema: {
        querystring: GetProxyQueryStringSchema,
        params: ModuleParamsSchema,
      },
    },
    getProxy
  );
}

export default configure;
