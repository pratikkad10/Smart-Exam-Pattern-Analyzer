# Product Requirements Document (PRD)
**Project Name:** Smart Exam Pattern Analyzer  
**Document Version:** 1.0  

---

## 1. Project Overview
**What is it?** The Smart Exam Pattern Analyzer is an AI-powered web application designed to help students study smarter. Instead of manually reading through years of past exam papers, students can upload them to the app. The AI reads the PDFs, extracts the questions, finds important topics, and allows students to chat directly with the exam data.

## 2. Problem & Solution
**The Problem:** Students waste hours downloading and reading old university exam PDFs to figure out which topics carry the most marks or get repeated often. 

**The Solution:** An automated system where users upload PDFs. The AI extracts and organizes the questions into a database. Students can then view analytics (like frequently asked questions), generate practice quizzes, and use an AI chatbot to ask things like, *"What are the most asked questions in Unit 2?"*

## 3. Technology Stack (What we are using)
* **Frontend:** React.js, Tailwind CSS (for styling), Vite, React Router.
* **Backend:** Node.js, Express.js (for APIs).
* **Database:** PostgreSQL (to store users and paper info) with Prisma ORM.
* **AI / Vector Database:** Qdrant (to store AI embeddings) and LangChain with Hugging Face Inference API (for embeddings and LLM-based extraction).

## 4. User Roles (Who will use this?)
1.  **Student (Main User):** Can upload papers, chat with the AI, generate quizzes, and view study plans.
2.  **Admin:** Can manage users, delete bad uploads, and monitor system health.

---

## 5. Core Features (MVP - Minimum Viable Product)
These are the features we MUST build for the first working version of the app.

### Feature 1: User Authentication
* Users can sign up, log in, and log out using an email and password.
* Protected routes (e.g., you can't view the dashboard without logging in).

### Feature 2: PDF Upload & Question Extraction
* A page where users can upload PDF exam papers.
* The backend reads the PDF (OCR) and uses AI to extract questions, marks, and units.
* Extracted data is saved into the PostgreSQL database.

### Feature 3: AI Chatbot (RAG System)
* A chat interface where students can talk to the uploaded exam papers.
* **Example prompt:** *"List all 8-mark questions from the 2019 database management paper."*
* The system searches the Vector Database (Qdrant) to find the right context and generates an answer.

### Feature 4: Analytics & Study Planner
* A dashboard showing graphs of which topics/units are asked most frequently.
* A button to "Generate Study Plan" that creates a customized schedule based on important topics.

### Feature 5: AI Quiz Generator
* A feature that automatically creates a short multiple-choice quiz based on the extracted exam questions so students can test themselves.

---

## 6. User Stories (Developer To-Do List)
*User stories help developers understand exactly what the user wants to achieve.*

* **Auth:** As a student, I want to log in securely so that my uploaded papers and chats are private.
* **Upload:** As a student, I want to drag and drop a PDF paper so that the system can process it.
* **Extraction:** As a developer, I want the backend to parse the PDF text and format it into a structured JSON object so it can be saved in Postgres.
* **Chat:** As a student, I want a chat window where I can ask questions about the syllabus and get instant answers based on past papers.
* **Quiz:** As a student, I want to click "Generate Quiz" so I can practice what I just learned.

---

## 7. Success Criteria (How do we know we are done?)
1.  A user can successfully register and log in.
2.  A user can upload a standard university exam PDF and the system successfully saves the extracted questions to the database without crashing.
3.  The chatbot answers questions accurately based *only* on the uploaded PDFs, taking less than 5 seconds to reply.
4.  The UI looks clean, modern, and works on both desktop and mobile screens.

---

## 8. Future Enhancements (Ideas for V2.0)
*These are things we will build later after the MVP is done.*
* Support for analyzing handwritten answer sheets.
* Reading and extracting diagrams/images from question papers.
* A voice-based AI assistant.
* Multi-language support for regional university papers.