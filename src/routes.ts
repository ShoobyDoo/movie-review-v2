import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Routes with header/footer
  layout("./layouts/MainLayout.tsx", [
    index("./App.tsx"),
    route("*", "./routes/NotFound.tsx"),
  ]),

  // Auth routes (no main layout)
  route("login", "./routes/Login.tsx"),
  route("register", "./routes/Register.tsx"),
] satisfies RouteConfig;
