import bcrypt from "bcrypt";
import envConfig from "./src/config/config";
import User from "./src/database/models/userModel";

const adminSeeder = async () => {
  try {
    const [data] = await User.findAll({
      where: { email: envConfig.adminEmail },
    });
    if (!data) {
      await User.create({
        username: envConfig.adminUserName,
        email: envConfig.adminEmail,
        password: bcrypt.hashSync(envConfig.adminPassword as string, 10),
        role: "admin",
      });
      console.log("Admin seeded!!");
    } else {
      console.log("Admin already seeded!");
    }
  } catch (error) {
    console.error("Error!");
  }
};

export default adminSeeder;
