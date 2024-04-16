import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import cron from 'node-cron';
import Router from "./routes";
import fetch from "node-fetch";

const PORT = process.env.PORT || 8001;

const appBase: Application = express();

appBase.use(express.json());
appBase.use(morgan("tiny"));
appBase.use(cors({ origin: true, credentials: true }));
appBase.use(Router);

appBase.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});


cron.schedule('0 * * * *', () => {
  fetch('http://localhost:' + process.env.PORT + '/internet-speed-test')
  console.log('running internet speed test every hour');
});