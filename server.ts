import adminSeeder from "./adminSeeder";
import app from "./src/app";
import envConfig from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
const startServer = () => {
  const port = envConfig.port || 4000;
  adminSeeder();
  categoryController.seedCategory();
  app.listen(port, () => {
    console.log(`Listening at port http://localhost:${port}`);
  });
};

startServer();
