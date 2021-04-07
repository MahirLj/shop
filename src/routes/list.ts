import express from "express";
import controller from "../controllers/list";
import signJWT from "../middleware/extractJWT";

const router = express.Router();

router.post("/create",signJWT, controller.createList);
router.put("/update",signJWT, controller.updateList);
router.delete("/delete/:id",signJWT, controller.deleteList);
router.get("/get",signJWT, controller.getAll);

export = router;
