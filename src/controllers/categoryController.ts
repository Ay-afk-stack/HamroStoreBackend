import { Request, response, Response } from "express";
import Category from "../database/models/categoryModel";
import sendResponse from "../services/sendResponse";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Foods",
    },
  ];
  async seedCategory() {
    const [data] = await Category.findAll();
    if (!data) {
      await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully!");
    } else {
      console.log("Categories already seeded!");
    }
  }
  async addCategory(req: Request, res: Response) {
    const { categoryName } = req.body;
    if (!categoryName) {
      sendResponse(res, 400, false, "Enter Category name!");
      return;
    }
    try {
      const [data] = await Category.findAll({ where: { categoryName } });
      if (data) {
        sendResponse(res, 400, false, "Category exist already!");
        return;
      }
      await Category.create({ categoryName });
      sendResponse(res, 201, true, "Category Created successfully!");
    } catch (err) {
      console.error(err);
      sendResponse(res, 500, false, "Server Error!");
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.findAll();
      if (!categories) {
        sendResponse(res, 404, false, "No category found!");
        return;
      }
      sendResponse(res, 200, true, "Fetched Categories", categories);
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, false, "Server Error");
    }
  }
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      sendResponse(res, 400, false, "Please enter id to delete!");
      return;
    }
    try {
      const data = await Category.findByPk(id);
      if (!data) {
        sendResponse(res, 404, false, "No category found!");
        return;
      }
      await Category.destroy({ where: { id } });
      sendResponse(res, 200, true, "Category Deleted!");
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, false, "Server Error");
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!id || !categoryName) {
      sendResponse(
        res,
        400,
        false,
        "Please enter id and categoryName to update!"
      );
      return;
    }
    try {
      const data = await Category.findByPk(id);
      if (!data) {
        sendResponse(res, 404, false, "No category found!");
        return;
      }
      await Category.update({ categoryName }, { where: { id } });
      sendResponse(res, 200, true, "Category updated successully!");
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, false, "Server Error");
    }
  }
}

export default new CategoryController();
