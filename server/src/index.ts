import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./db/database";
import { sleepRouter } from "./routes/sleep";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use("/api/sleep", sleepRouter);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log("Error during Data Source initialization:", error));
