# 📋 Mini Task Tracker

A full-stack Task Tracker web application built with **Next.js** (frontend) and **Node.js + Express** (backend), using **MongoDB** for persistence and **Redis** for caching.

## 🏗️ Architecture

This is a **monorepo** managed with npm workspaces:

```
task-tracker/
├── apps/
│   ├── server/        # Backend - Express + TypeScript + Mongoose + Redis
│   └── web/           # Frontend - Next.js + TypeScript
├── package.json       # Root workspace config
├── tsconfig.base.json # Shared TypeScript configuration
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis
- **Auth**: JWT + bcrypt
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** running locally or a MongoDB Atlas URI
- **Redis** running locally or a Redis Cloud URI

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd task-tracker

# Install all dependencies (root + all workspaces)
npm install
```

### Environment Setup

```bash
# Copy the example env file for the backend
cp apps/server/.env.example apps/server/.env

# Edit the .env file with your actual values
```

### Running the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them individually:
npm run dev:server   # Backend on http://localhost:3001
npm run dev:web      # Frontend on http://localhost:3000
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## 📡 API Endpoints

| Method | Endpoint            | Description              | Auth Required |
|--------|---------------------|--------------------------|:---:|
| POST   | `/api/auth/signup`  | Create new user          | ❌ |
| POST   | `/api/auth/login`   | Authenticate user (JWT)  | ❌ |
| GET    | `/api/tasks`        | List tasks for user      | ✅ |
| POST   | `/api/tasks`        | Create a new task        | ✅ |
| PUT    | `/api/tasks/:id`    | Update a task            | ✅ |
| DELETE | `/api/tasks/:id`    | Delete a task            | ✅ |

## 📦 Scripts

| Script               | Description                          |
|----------------------|--------------------------------------|
| `npm run dev`        | Start all apps in development mode   |
| `npm run dev:server` | Start backend only                   |
| `npm run dev:web`    | Start frontend only                  |
| `npm run build`      | Build all apps                       |
| `npm test`           | Run all tests                        |
| `npm run test:coverage` | Run tests with coverage report    |
| `npm run clean`      | Clean all build artifacts            |

## 📄 License

ISC
