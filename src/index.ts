import express from "express";
import dotenv from "dotenv";
import { taskRouter } from "./routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/tasks", taskRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ATOM server running on port ${PORT}`);
});