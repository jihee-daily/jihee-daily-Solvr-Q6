import { Router } from "express";
import { AppDataSource } from "../db/database";
import { Sleep } from "../entities/Sleep";

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
        res.status(500).json({ error: "수면 기록 조회 중 오류가 발생했습니다." });
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