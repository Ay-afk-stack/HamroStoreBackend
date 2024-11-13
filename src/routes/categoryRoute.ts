import express, { Router } from "express";
import categoryController from "../controllers/categoryController";
import userMiddleware from "../middleware/userMiddleware";
const router: Router = express.Router();

router
  .route("/")
  .post(userMiddleware.isUserLoggedIn, categoryController.addCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
