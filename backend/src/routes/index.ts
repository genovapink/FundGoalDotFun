import { Router } from "express";

// Services
import { router as AccountServices } from "@services/account";

const router = Router();

router.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});

router.use("/auth", AccountServices);

export { router as GlobalRouter };
