import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/_layout.tsx", [
    index("./routes/index.tsx"),
    route("/api/list", "./routes/landing/list.tsx"),
    route("/about", "./routes/about/index.tsx"),
    route("/create", "./routes/create/index.tsx"),
    route(":ca", "./routes/details-ca/index.tsx"),
    route("/profile", "./routes/profile/index.tsx"),
  ]),
] satisfies RouteConfig;