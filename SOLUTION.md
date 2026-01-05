# Tekkr Hiring Test - Full Stack Solution

This repository contains the completed solution for the Tekkr Full Stack Hiring Challenge.

## Features Implemented

### 1. LLM Chat Integration (OpenAI)
- **OpenAI Integration:** The application now uses the OpenAI API (`gpt-3.5-turbo` and `gpt-4o`) to handle chat messages.
- **Model Selector:** A dropdown menu in the chat window allows users to switch between available OpenAI models.
- **Environment Configuration:** The server uses `OPENAI_API_KEY` from the `.env` file.
- **Robust Error Handling:** The system includes a simulated fallback mode. If the API key is missing or invalid, the app mimics a working assistant for demonstration purposes (try asking "Hello" or "Project Plan" without a key).

### 2. Chat Experience Improvements
- **Auto-Naming:** Chats start with the title "New Chat". After the first message, the system automatically generates a concise, relevant title based on the context of the conversation.
- **Keyboard Shortcuts:**
  - `Enter`: Send message (standard).
  - `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows): Also sends the message.
  - `Shift+Enter`: Inserts a new line.
- **Loading State:** A "Working on it..." indicator appears while waiting for the AI response.

### 3. Project Plan Preview
- **Interactive UI:** When the user requests a project plan (e.g., "Create a project plan for a coffee shop"), the system renders a rich, interactive card instead of plain text.
- **Structure:** The plan is organized into "Workstreams" and "Deliverables".
- **Collapsible Sections:** Workstreams can be expanded or collapsed to keep the view clean.
- **Inline Rendering:** The preview is rendered inline within the chat stream.

## Technical Implementation Details

### Backend (`server/`)
- **Fastify & TypeScript:** Built on the existing Fastify boilerplate.
- **OpenAI SDK:** Replaced the initial Google Gemini setup with the official `openai` Node.js library.
- **In-Memory Storage:** Chat history and metadata are stored in memory using a Singleton `ChatStore` class (`server/src/services/storage.ts`).
- **CORS Fix:** Adjusted the CORS configuration to properly handle preflight `OPTIONS` requests, which was initially blocking frontend communication.

### Frontend (`web/`)
- **React & Shadcn UI:** Leveraged existing components and added new ones for the chat interface.
- **React Markdown:** Used to render standard chat text.
- **Custom Parsing:** Implemented logic in `MessageContent` to detect `<project-plan>` tags in the AI response and render the `ProjectPlanPreview` component instead of raw JSON.
- **React Query:** Used for efficient data fetching and state management (caching chats, mutation for sending messages).

## How to Run

### Prerequisites
- Node.js (v18+ recommended)
- An OpenAI API Key

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file and add your OpenAI API key:
     ```env
     OPENAI_API_KEY=sk-...
     ```
4. Start the server:
   ```bash
   npm run dev:start
   ```
   The server will run on `http://localhost:8000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`.

## Usage Guide

1. **Start a Chat:** Click "New Chat" in the sidebar.
2. **Select Model:** Choose your preferred model (e.g., GPT-3.5 Turbo) from the top-right dropdown.
3. **Send Message:** Type your message and press Enter (or Cmd/Ctrl+Enter).
4. **Project Plan:** To see the preview feature, ask something like:
   > "Create a project plan for launching a mobile app."
5. **Auto-Title:** Notice the sidebar title update after your first message exchange.

