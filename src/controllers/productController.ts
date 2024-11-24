import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

export interface IProductRequest extends Request {
  file?: {
    filename: string;
  };
}

class ProductController {
  async createProduct(req: IProductRequest, res: Response) {
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      CategoryId,
    } = req.body;

    const imageFilename = req.file
      ? req.file.filename
      : "https://dummyimage.com/300";

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock
    ) {
      sendResponse(res, 400, false, "Enter all the product Details");
      return;
    }
    try {
      await Product.create({
        productName,
        productDescription,
        productPrice,
        productTotalStock,
        discount: discount || 0,
        CategoryId,
        productImageUrl: imageFilename,
      });
      sendResponse(res, 201, true, "Product added Successfully!");
    } catch (error) {
      console.error("Product Create garda Error", error);
      sendResponse(res, 500, false, "Server Error!");
    }
  }
  async getAllProduct(req: Request, res: Response) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
          },
        ],
      });
      sendResponse(res, 200, true, "Data Fetched Successfully!", [
        { products },
      ]);
    } catch (error) {
      console.error("Product Fetch Error", error);
      sendResponse(res, 500, false, "Server Error!");
    }
  }
  async getSingleProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await Product.findAll({
        where: { id },
        include: [
          {
            model: Category,
          },
        ],
      });
      sendResponse(res, 200, true, "Data Fetched Successfully!", [{ product }]);
    } catch (error) {
      console.error("Single Product Error", error);
      sendResponse(res, 500, false, "Server error");
    }
  }
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [product] = await Product.findAll({
        where: { id },
        include: [
          {
            model: Category,
          },
        ],
      });

      if (!product) {
        sendResponse(res, 404, false, "Product not Found!");
        return;
      }
      await Product.destroy({
        where: {
          id,
        },
      });
      sendResponse(res, 200, true, "Product Deleted Successfully!");
    } catch (err) {
      console.error("Product ma Error", err);
      sendResponse(res, 500, false, "Server Error");
    }
  }
  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId,
    } = req.body;
    try {
      const [product] = await Product.findAll({
        where: {
          id,
        },
        include: [{ model: Category }],
      });
      if (!product) {
        sendResponse(res, 404, false, "Product not found!");
        return;
      }
      await Product.update(
        {
          productName,
          productDescription,
          productPrice,
          productTotalStock,
          discount,
          categoryId,
        },
        { where: { id } }
      );
      sendResponse(res, 200, true, "Product Updated!");
    } catch (err) {
      console.error("Update Error", err);
      sendResponse(res, 500, false, "Server ERROR!");
    }
  }
}

export default new ProductController();
