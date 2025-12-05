# Token Usage Dashboard

Simple dashboard to track token usage with a FastAPI backend and React + Vite frontend.

## Prerequisites

- Docker

## Project Structure

```bash
/credits-usage-dashboard
├─ backend/        # FastAPI backend
├─ frontend/       # React + Vite frontend
└─ docker-compose.yml
```

## Setup & Run

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <parent-folder>
```

2.  Build and start the app:

`docker compose up --build`

### Stop the app

`docker compose down`

## Notes & Concessions

I wanted to highlight a few decisions and trade-offs I made while building the dashboard, especially where time constraints shaped the final result:

- **Endpoint typing**: The `/usage` endpoint isn’t fully typed with Pydantic response models. In a real project I’d make sure every endpoint has strict schemas for inputs and outputs, but I prioritized getting the feature working end-to-end first.

- **Date formatting**: I used a simple local formatter for dates. It works fine here, but if the project grew or needed more complex date handling, I would switch to something like Day.js or date-fns to avoid edge-case bugs and keep formatting consistent.

- **Tests**: I added a very lightweight set of tests around the key calculation logic. Ideally, there would be far more coverage, such as API layer tests, error cases, integration tests, etc. With more time, I’d expand this significantly.

- **Frontend fetching**: The `useFetch` hook does the job but isn’t as robust as something like React Query. In a larger application I would use React Query for caching, retries, stale-while-revalidate behaviors, and generally better data flow.

- **Report fallback logic**: When a report can't be fetched from `/reports/:id`, the backend currently skips that message. In a production setup, I’d either compute a fallback token estimate or record incomplete data so nothing gets lost.

- **Chart labels and formatting**: Some chart formatting (axis labels, font sizes, thresholds) is kept simple and uses a few “magic numbers” and "magic strings". With more time I’d extract these into constants or a shared theme for better readability and maintainability.

- **Docker setup**: The Dockerfiles and docker-compose configuration are intentionally minimal. For example, backend image includes unit tests. A production setup would include health checks, multistage builds for smaller images, and environment-specific configs and only necessary files would be included.

- **Responsiveness**: I’d continue improving is the responsive design. Some elements still feel too large on smaller screens, and with more time I’d refine the layout and sizing to make the experience smoother on mobile.

Overall, the goal here was to build a clean, working version of the dashboard within several hours without over-engineering it. With more time, I’d expand typing, tests, caching, error handling, and infrastructure.

## Why this tech stack?

**Backend (FastAPI)**:
I went with FastAPI because it’s simple, fast to work with, and gives type safety without extra effort. It let me build clean endpoints quickly, and if I had enough time it would be very easy to add Pydantic validation. For a small service like this, it felt like the right balance of structure and speed.

**Frontend (React + Vite)**:
React was part of the requirements, so the main choice was how to set up the development environment. I chose Vite because it starts instantly, has reliable hot reloading, and keeps the configuration lightweight. For a project where I need to iterate on UI changes quickly, Vite makes things feel much smoother than older tooling.

**Charts (Recharts)**:
I picked Recharts mainly because it’s straightforward and integrates nicely with React. It gives the basics needed for a dashboard without heavy configuration, which was enough for this scope.

**Docker and Docker Compose**:
Containerizing both apps keeps everything consistent and easy to run. Docker Compose lets the whole project spin up with one command, which seemed practical for anyone reviewing it or running it locally.
