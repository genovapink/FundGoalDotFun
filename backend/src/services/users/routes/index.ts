import { Router } from "express";
import { findItems } from "../controller/find";
import { createItem } from "../controller/create";

const router = Router();

router.get("/", findItems);
router.post("/", createItem);

export { router };
