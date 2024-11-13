import { config } from "dotenv";
config();

const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  email: process.env.EMAIL,
  password: process.env.EMAILPASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
  adminUserName: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};

export default envConfig;
