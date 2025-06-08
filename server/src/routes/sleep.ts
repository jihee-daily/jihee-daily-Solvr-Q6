import { Router } from "express";
import { AppDataSource } from "../db/database";
import { Sleep } from "../entities/Sleep";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const sleepRepository = AppDataSource.getRepository(Sleep);

// 수면 기록 생성
router.post("/", async (req, res) => {
    try {
        const { sleepTime, wakeTime, quality, notes } = req.body;
        const sleep = new Sleep();
        sleep.sleepTime = new Date(sleepTime);
        sleep.wakeTime = new Date(wakeTime);
        sleep.duration = (new Date(wakeTime).getTime() - new Date(sleepTime).getTime()) / (1000 * 60 * 60); // 시간 단위
        sleep.quality = quality;
        sleep.notes = notes;

        const result = await sleepRepository.save(sleep);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "수면 기록 생성 중 오류가 발생했습니다." });
    }
});

// 모든 수면 기록 조회
router.get("/", async (req, res) => {
    try {
        const sleeps = await sleepRepository.find({
            order: { createdAt: "DESC" }
        });
        res.json(sleeps);
    } catch (error) {
        console.error("수면 기록 조회 중 에러 발생:", error);
        res.status(500).json({ error: "수면 기록 조회 중 오류가 발생했습니다." });
    }
});

// AI 조언 생성 (스트리밍 방식, gemma 모델 사용)
router.get("/advice", async (req, res) => {
  try {
    const sleepRecords = await sleepRepository.find({
      order: { sleepTime: "DESC" },
      take: 30,
    });

    if (sleepRecords.length < 5) {
      // 데이터가 적을 경우 스트리밍이 아닌 일반 JSON으로 응답
      return res.json("수면 데이터가 5일치 이상 쌓이면 AI 분석을 받을 수 있어요. 꾸준히 기록해보세요!");
    }

    const formattedData = sleepRecords.map(r => ({
      date: r.sleepTime.toISOString().split('T')[0],
      sleepTime: r.sleepTime.toTimeString().slice(0, 5),
      wakeTime: r.wakeTime.toTimeString().slice(0, 5),
      duration: r.duration,
      quality: r.quality,
      notes: r.notes,
    }));

    const promptText = `
      한국어로 답변해주세요.
      당신은 데이터 기반으로 사용자의 수면을 분석하고 개선을 돕는 전문 '수면 코치'입니다.
      아래 수면 데이터를 분석해서, 다음 마크다운 형식에 맞춰 전문적이고 격려하는 말투로 답변해주세요.
      응답은 '### ☀️' 로 시작해야 하며, 각 항목은 아주 간결하게 한두 문장으로 작성해주세요.
      **주어진 형식 외에 '꿀팁' 등의 다른 내용은 절대로 추가하지 마세요.**

      ### ☀️ 오늘의 수면 점수: [AI가 계산한 100점 만점의 점수]/100점
      - **총평**: (데이터를 기반으로 어젯밤 잠에 대한 한 문장 요약)
      - **점수 분석**: (왜 해당 점수가 나왔는지 데이터에 근거해 간단히 분석)

      ### 👩‍🔬 오늘의 꿀잠 미션!
      (더 나은 잠을 위한 **단 하나의 구체적인 미션**을 딱 한 문장으로 제안해주세요.)

      \`\`\`json
      ${JSON.stringify(formattedData, null, 2)}
      \`\`\`
    `;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 제공된 코드 형식에 맞게 모델, 설정, 컨텐츠 구성
    const modelName = 'gemma-3-1b-it';
    const generationConfig = {
      responseMimeType: 'text/plain',
    };
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig });

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ];

    const result = await model.generateContentStream({ contents });
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    res.end();

  } catch (error) {
    console.error("AI 조언 생성 실패:", error);
    res.status(500).send("AI 조언을 생성하는 중 오류가 발생했습니다.");
  }
});

// 특정 수면 기록 조회
router.get("/:id", async (req, res) => {
    try {
        const sleep = await sleepRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (!sleep) {
            return res.status(404).json({ error: "수면 기록을 찾을 수 없습니다." });
        }
        res.json(sleep);
    } catch (error) {
        res.status(500).json({ error: "수면 기록 조회 중 오류가 발생했습니다." });
    }
});

// 수면 기록 수정
router.put("/:id", async (req, res) => {
    try {
        const { sleepTime, wakeTime, quality, notes } = req.body;
        const sleep = await sleepRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!sleep) {
            return res.status(404).json({ error: "수면 기록을 찾을 수 없습니다." });
        }

        sleep.sleepTime = new Date(sleepTime);
        sleep.wakeTime = new Date(wakeTime);
        sleep.duration = (new Date(wakeTime).getTime() - new Date(sleepTime).getTime()) / (1000 * 60 * 60);
        sleep.quality = quality;
        sleep.notes = notes;

        const result = await sleepRepository.save(sleep);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "수면 기록 수정 중 오류가 발생했습니다." });
    }
});

// 수면 기록 삭제
router.delete("/:id", async (req, res) => {
    try {
        const result = await sleepRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ error: "수면 기록을 찾을 수 없습니다." });
        }
        res.json({ message: "수면 기록이 삭제되었습니다." });
    } catch (error) {
        res.status(500).json({ error: "수면 기록 삭제 중 오류가 발생했습니다." });
    }
});

export const sleepRouter = router;