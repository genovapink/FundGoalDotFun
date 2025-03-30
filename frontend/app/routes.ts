import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("./routes/_layout.tsx", [
    index("./routes/index.tsx"),
    route("/about", "./routes/about/index.tsx"),
    route("/create", "./routes/create.tsx"),
    route(":ca", "./routes/details-ca/index.tsx"),
    route("/profile", "./routes/profile/index.tsx"),
    // ...prefix("/market", [
    // index("./routes/market/index.tsx"),
    // ]),
  ]),
] satisfies RouteConfig;
