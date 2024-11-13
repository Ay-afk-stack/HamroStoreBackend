import adminSeeder from "./adminSeeder";
import app from "./src/app";
import envConfig from "./src/config/config";
const startServer = () => {
  const port = envConfig.port || 4000;
  adminSeeder();
  app.listen(port, () => {
    console.log(`Listening at port http://localhost:${port}`);
  });
};

startServer();
