import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { pool } from "./db";

// Debug
console.log("Worker started");
console.log("REDIS_URL:", process.env.REDIS_URL);

//  Redis connection (Upstash-compatible)
const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  tls: {},
});

//  Worker
const worker = new Worker(
  "tasks", //  MUST match queue name exactly
  async (job) => {
    console.log("Received job:", job.data);

    const { taskId, input } = job.data;

    try {
      // simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // update DB
      await pool.query(
        "UPDATE tasks SET status = $1, result = $2 WHERE id = $3",
        ["completed", `Processed: ${input}`, taskId]
      );

      console.log("Finished task:", taskId);
    } catch (err) {
      console.error("Worker error:", err);

      await pool.query(
        "UPDATE tasks SET status = $1, error = $2 WHERE id = $3",
        ["failed", "Worker processing failed", taskId]
      );
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});