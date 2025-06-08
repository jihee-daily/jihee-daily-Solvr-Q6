import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./db/database";
import { sleepRouter } from "./routes/sleep";
import cors from "cors";

// --- 환경 변수 확인용 코드 ---
console.log("--- 환경 변수 로딩 확인 ---");
if (process.env.GEMINI_API_KEY) {
  console.log("✅ GEMINI_API_KEY가 성공적으로 로드되었습니다.");
  console.log(`(API 키 일부: ${process.env.GEMINI_API_KEY.slice(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)})`);
} else {
  console.error("❌ GEMINI_API_KEY를 찾을 수 없습니다! server/.env 파일을 확인해주세요.");
}
console.log("--------------------------");
// --------------------------

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
