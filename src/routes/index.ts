import express from "express";
import { fastSpeedTest } from "../utils/internet.util";

const router = express.Router();

router.get("/internet-speed-test", async (req, res) => {
  let fastRes = await fastSpeedTest()
  res.send(fastRes)
});

export default router;
