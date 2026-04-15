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

```json
{
  "input": "hello world"
}
