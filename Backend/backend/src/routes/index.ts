import { Router } from "express";
import { router as AccountServices } from "@services/account";
import { router as TokenServices } from "@services/tokens";
import { router as UserServices } from "@services/users";
import { router as MarketServices } from "@services/market";

const router = Router();

router.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});

const services = [
  { path: "/auth", router: AccountServices },
  { path: "/tokens", router: TokenServices },
  { path: "/users", router: UserServices },
  { path: "/market", router: MarketServices },
];

services.forEach(({ path, router: serviceRouter }) => {
  router.use(`/api${path}`, serviceRouter);
});

export { router as GlobalRouter };
