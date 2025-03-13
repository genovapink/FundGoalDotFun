import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  //
  index("routes/index.tsx"),
  route("/about", "routes/about.tsx"),
  ...prefix("/market", [
    index("routes/market/index.tsx"),
    route(":symbol", "routes/market/symbol.tsx"),
  ]),
] satisfies RouteConfig;
