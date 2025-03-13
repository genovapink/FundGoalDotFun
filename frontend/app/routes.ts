import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("./routes/_layout.tsx", [
    index("./routes/index.tsx"),
    route("/about", "./routes/about.tsx"),
    ...prefix("/market", [
      index("./routes/market/index.tsx"),
      route(":symbol", "./routes/market/symbol.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
