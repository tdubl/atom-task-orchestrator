import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { pool } from "./db";

console.log("Worker started");

const connection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
    tls: {},
});

const worker = new Worker(
    "tasks",
    async (job) => {
        console.log("Received job:", job.data);

        const { taskId, input } = job.data;

        try {
            await pool.query(
                "UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
                ["processing", taskId]
            );

            await new Promise((resolve) => setTimeout(resolve, 2000));

            await pool.query(
                "UPDATE tasks SET status = $1, result = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
                ["completed", `Processed: ${input}`, taskId]
            );

            console.log("Finished task:", taskId);
        } catch (err) {
            console.error("Worker error:", err);

            await pool.query(
                "UPDATE tasks SET status = $1, error = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
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