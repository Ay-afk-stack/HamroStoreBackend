import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/config";

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

sequelize.sync({ force: false }).then(() => {
  console.log("Synced");
});

export default sequelize;
