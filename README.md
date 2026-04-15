# ATOM — AI Task Orchestration Manager

ATOM is an event-driven backend system for orchestrating long-running tasks with asynchronous workers, persistent task state, and Redis-backed job queues.

## Features

- REST API for task creation and retrieval
- Asynchronous job processing with BullMQ
- Redis-backed queue using Upstash
- Persistent task storage in PostgreSQL via Neon
- Worker-based execution pipeline
- Task lifecycle states:
  - pending
  - processing
  - completed
  - failed
- Retry and backoff support for failed jobs

## Stack

- Node.js
- TypeScript
- Express
- PostgreSQL (Neon)
- Redis (Upstash)
- BullMQ
- ioredis

## Architecture

Client → Express API → PostgreSQL  
Client → Express API → Redis Queue → Worker → PostgreSQL

## Endpoints

### Create task
`POST /tasks`

Example body:
{
  "input": "hello world"
}

---

### Get task
`GET /tasks/:id`

---

## Task Lifecycle

1. Client submits a task  
2. API stores task in PostgreSQL with `pending` status  
3. API enqueues a Redis job  
4. Worker picks up the job and marks it `processing`  
5. Worker completes processing and updates the task to `completed`  
6. If all retry attempts fail, the task is marked `failed`  

---

## Local Development

### Install dependencies
npm install


### Start API server
npm run dev


### Start worker
npx ts-node src/worker.ts

---

## Environment Variables
DATABASE_URL=your_neon_connection_string

REDIS_URL=your_upstash_tcp_connection_string

PORT=3000

---

## Example Usage

### Create a task
curl -X POST http://localhost:3000/tasks
 -H "Content-Type: application/json" -d "{"input":"hello atom"}"


### Get a task
curl http://localhost:3000/tasks/
<task_id>


---

## Why I Built This

I built ATOM to move beyond basic CRUD apps and practice backend patterns used in production systems:

- asynchronous workflows  
- queue-based architecture  
- worker orchestration  
- persistent state management  
- failure handling across distributed components  

---

## Future Improvements

- WebSocket-based live task updates  
- Dockerized local development  
- Metrics and observability  
- Authentication and multi-user task ownership  
- Deployment to AWS  
