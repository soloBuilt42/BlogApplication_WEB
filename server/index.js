import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dbConnection from "./dbConfig/index.js";
import router from "./routes/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

dbConnection();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan("dev"));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
