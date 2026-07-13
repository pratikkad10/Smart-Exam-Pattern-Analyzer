# Smart Exam Pattern Analyzer - Backend

This is the backend service for the **Smart Exam Pattern Analyzer**. It provides the API for the frontend, processes PDF uploads, extracts data using AI, and manages storage in both a relational database and a vector database.

## 🛠 Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database (Relational):** PostgreSQL 15 (for user & metadata storage)
- **Database (Vector):** Qdrant (for AI embeddings and RAG)
- **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started (Local Development)

The easiest way to run the entire backend stack (Node.js API, PostgreSQL, and Qdrant) is by using Docker Compose.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Git](https://git-scm.com/) installed.

### 2. Environment Setup (Setting up passwords)
Before starting the app, you need to set up some secret passwords for your database. We use a special hidden file called `.env` to store these securely.

1. Look inside your `backend` folder. You will see a file named `.env.example`. 
2. **Make a copy** of this file and rename the copy to just `.env` (make sure there is a dot at the start!).
3. Open this new `.env` file in your code editor. It will be empty. Copy and paste the following lines into it:
   ```env
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=sepa_db
   ```
*(Note: Never share or upload your `.env` file to GitHub, it contains your private passwords!)*

### 3. Start the Application
You don't need to manually install databases or complex server tools on your computer. Docker handles all the heavy lifting for you automatically!

1. Make sure the **Docker Desktop** application is open and running on your computer.
2. Open your terminal (or Command Prompt / VS Code terminal), make sure you are inside the `backend` folder, and type this exact command:
   ```bash
   docker compose up -d --build
   ```
3. **What is happening?** Docker is downloading PostgreSQL (a database), Qdrant (an AI database), and starting your Node.js server. The `-d` part means it runs quietly in the background so you can keep using your terminal.

Once it finishes loading, your application is fully running!
- **Your backend API is live at:** `http://localhost:5000`

### 4. Stopping the Application
When you are done working for the day and want to turn off the servers to save your computer's battery and memory, open your terminal in the `backend` folder and run:
```bash
docker compose stop
```
*Don't worry, all your database data is safely saved permanently on your hard drive, even when it's turned off!* To turn everything back on tomorrow, simply run `docker compose start`.

---

## 📂 Project Structure

- `Dockerfile`: The instructions for building the production-ready Node.js image.
- `docker-compose.yml`: Orchestrates the Node.js API, PostgreSQL, and Qdrant containers.
- `.env.example`: Template for required environment variables.
- `index.js`: The entry point for the Express server.
- `package.json`: Project dependencies and scripts.

---

## 🔒 Security Notes
- **Do not commit `.env` to version control.** It is already ignored in `.gitignore`.
- The databases (Postgres & Qdrant) are strictly confined to the internal Docker network for security. They do not expose their ports to the host machine. If you need local host access (e.g., using pgAdmin), you will need to map ports in `docker-compose.yml`.


## 📁 Backend Folder Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js               # Postgres connection
│   │   ├── qdrant.js           # Qdrant connection
│   │   ├── llm.js              # Gemini config
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── paper.controller.js
│   │   ├── chat.controller.js
│   │   ├── quiz.controller.js
│   │   └── studyPlan.controller.js
│   │
│   ├── services/
│   │   │
│   │   ├── pdf/
│   │   │   ├── extractText.service.js
│   │   │   ├── chunkText.service.js
│   │   │   └── upload.service.js
│   │   │
│   │   ├── llm/
│   │   │   ├── extractQuestions.service.js
│   │   │   ├── generateQuiz.service.js
│   │   │   ├── studyPlan.service.js
│   │   │   └── chat.service.js
│   │   │
│   │   ├── embeddings/
│   │   │   ├── embedding.service.js
│   │   │   ├── vectorStore.service.js
│   │   │   └── rag.service.js
│   │   │
│   │   └── analytics/
│   │       ├── frequency.service.js
│   │       └── prediction.service.js
│   │
│   ├── models/
│   │   ├── paper.model.js
│   │   ├── question.model.js
│   │   ├── user.model.js
│   │   ├── quiz.model.js
│   │   └── studyPlan.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── paper.routes.js
│   │   ├── chat.routes.js
│   │   ├── quiz.routes.js
│   │   └── studyPlan.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── logger.js
│   │   └── prompts.js
│   │
│   ├── validators/
│   │   ├── paper.validator.js
│   │   ├── auth.validator.js
│   │   └── chat.validator.js
│   │
│   ├── uploads/
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
└── package-lock.json
```