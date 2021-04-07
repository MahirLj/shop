import express from "express";
import controller from "../controllers/article";
import signJWT from "../middleware/extractJWT";

const router = express.Router();

router.delete("/delete/:id", signJWT, controller.deleteArticle);
router.post("/getReport", signJWT, controller.getReport);

export = router;
