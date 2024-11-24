import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";

const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [__dirname + "/models"],
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} catch (error) {
  console.error(error);
}

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Synced");
});

//relationships
Product.belongsTo(Category);
Category.hasOne(Product);

export default sequelize;
