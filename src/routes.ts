import { Router } from "express";
import { taskQueue } from "./queue";
import { pool } from "./db";

export const taskRouter = Router();

taskRouter.post("/", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const result = await pool.query(
      "INSERT INTO tasks (input) VALUES ($1) RETURNING *",
      [input]
    );

      const task = result.rows[0];

      await taskQueue.add("process-task", {
          taskId: task.id,
          input: task.input,
      });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});