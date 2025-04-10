import { Router } from "express";
import { allItemsOnlyName, findItemByContract, findItems } from "../controller/find";
import { createItem } from "../controller/create";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/:contractAddress", findItemByContract);
router.get("/", findItems);
router.get("/ticker/list", allItemsOnlyName);
router.post("/", upload.single("image"), createItem);

export { router };
