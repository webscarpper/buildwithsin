# Technical Documentation

## 1. Introduction

This document provides a technical overview of the application, including its architecture, components, and key technologies.

## 2. Technology Stack

The application is built with a modern, robust, and scalable technology stack.

### 2.1. Frontend

- **Framework**: [Next.js](https://nextjs.org/) (a React framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/) (via `tailwind-merge` and `class-variance-authority`)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Deployment**: [Vercel](https://vercel.com/)

### 2.2. Backend

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: [Python](https://www.python.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Caching**: [Redis](https://redis.io/) (via `upstash-redis`)
- **Containerization**: [Docker](https://www.docker.com/)
- **AI/LLM Orchestration**: [LiteLLM](https://litellm.ai/)
- **Payments**: [Stripe](https://stripe.com/)
- **Monitoring**: [Sentry](https://sentry.io/) and [Langfuse](https://langfuse.com/)

## 3. Architecture & Scalability

The application is designed with a decoupled frontend and backend architecture, which allows for independent scaling and development.

- **Scalable Backend**: The backend is containerized with Docker and can be deployed on any cloud provider. The use of FastAPI, an ASGI framework, allows for high-performance, asynchronous request handling.
- **Performant Frontend**: The frontend is built with Next.js and deployed on Vercel, which provides a global CDN, serverless functions, and automatic scaling.
- **Robust Database**: Supabase provides a managed PostgreSQL database that can be scaled as needed.
- **Efficient Caching**: Redis is used for caching frequently accessed data, reducing database load and improving response times.

## 4. Core AI Agent Capabilities

The heart of the application is its powerful AI agent, which is equipped with a variety of tools to perform complex tasks.

### 4.1. Standard Tools
- **Computer Use**: Interacts with a computer in a sandboxed environment.
- **Message Expander**: Expands and elaborates on messages.
- **Browser**: A sandboxed browser for web interaction.
- **Deployment**: Deploys applications.
- **Port Exposure**: Exposes ports for services.
- **File Management**: Manages files within the sandbox.
- **Shell**: A sandboxed shell for command-line operations.
- **Vision**: Can see and interpret images.
- **Agent Updater**: Can update its own configuration.
- **Web Search**: Searches the web for information.

### 4.2. Data Providers
The agent can connect to various data providers to access real-time information, including:
- Active Jobs
- Amazon
- LinkedIn
- Twitter
- Yahoo Finance
- Zillow

## 5. Security

Security is a top priority for the application. We have implemented several measures to protect our users and their data.

- **Sandboxed Environment**: All code execution and browsing happens in a sandboxed environment, isolating it from the main application and preventing malicious code from causing harm.
- **Supabase Security**: We leverage Supabase's built-in security features, including Row Level Security (RLS), to ensure that users can only access their own data.
- **Authentication**: Secure authentication is handled by Supabase Auth, which supports various authentication methods, including email/password and social logins.

## 6. Project Structure

The project is divided into two main parts: a `frontend` and a `backend`.

### 2.1. Frontend

The frontend is a Next.js application located in the `frontend` directory.

### 2.2. Backend

The backend is a Python application located in the `backend` directory. It uses Docker for containerization.

## 3. Backend Details

### 3.1. API

The main API is defined in [`backend/api.py`](backend/api.py). It's a FastAPI application that orchestrates various services and modules.

The API includes the following routers, all prefixed with `/api`:
- **Agent API**: Handles agent-related operations.
- **Sandbox API**: Provides a sandboxed environment for code execution.
- **Billing API**: Manages billing and subscriptions.
- **Feature Flags API**: Controls feature flags.
- **MCP API**: Manages MCP (Multi-Capability Peripheral) functionalities.
- **Transcription API**: Provides audio transcription services.
- **Email API**: Handles email-related tasks.
- **Hooks API**: Manages webhooks.

It also exposes the following endpoints:
- `GET /api/health`: A health check endpoint.
- `POST /api/mcp/discover-custom-tools`: Discovers custom MCP tools.

### 3.2. Agent Tools

The backend includes a set of agent tools located in `backend/agent/tools/`. These tools provide various functionalities, such as data providing, web searching, and more.

### 3.3. Services

The backend uses several services, including:
- Billing (`backend/services/billing.py`)
- Email (`backend/services/email.py`)
- Supabase (`backend/services/supabase.py`)

### 3.4. Database

The project uses Supabase for its database, with migrations located in `backend/supabase/migrations/`.

## 4. Frontend Details

### 4.1. Components

The frontend uses a component-based architecture, with components located in [`frontend/src/components/`](frontend/src/components/). The component library is extensive and organized into the following categories:

- **`basejump`**: Core components for account and team management.
- **`billing`**: Components related to billing, subscriptions, and usage.
- **`dashboard`**: Components for the main user dashboard.
- **`file-renderers`**: Components for rendering different file types (e.g., code, CSV, images).
- **`home`**: Components for the marketing/landing pages.
- **`payment`**: Components for handling payments.
- **`sidebar`**: Components for the application's side navigation.
- **`thread`**: Components for the chat/thread interface, including input, content display, and tool views.
- **`ui`**: A collection of reusable UI components (e.g., buttons, dialogs, cards).

### 4.2. API Routes

API routes for the frontend are defined in [`frontend/src/app/api/`](frontend/src/app/api/). The primary API route is:

- `GET /api/share-page/og-image`: This endpoint generates an Open Graph (OG) image for social media sharing. It takes a `title` query parameter and uses the Orshot API to create the image. The generated image is a PNG and is cached for performance.

### 4.3. Authentication

Authentication is handled in `frontend/src/app/auth/`.

## 5. Getting Started

### 5.1. Backend

To run the backend, you can use the Docker Compose file:

```bash
docker-compose up
```

### 5.2. Frontend

To run the frontend, navigate to the `frontend` directory and run:

```bash
npm install
npm run dev