import express from "express";
import { fastSpeedTest, ooklaSpeedTest } from "../utils/internet.util";

const router = express.Router();

router.get("/internet-speed-test", async (req, res) => {
  // let fastRes = await fastSpeedTest()
  let fastRes = await ooklaSpeedTest()
  res.send(fastRes)
});

export default router;
