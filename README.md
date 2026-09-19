# 🕹️ CodeArcade

> **Interactive, gamified coding platform designed for absolute beginners with an integrated AI tutor.**

CodeArcade transforms the beginner coding experience into an arcade adventure. Learners explore bite-sized coding quests, write real JavaScript in an in-browser sandbox, earn XP and retro badges, and collaborate with **Pixel**—an AI tutor programmed with strict pedagogical guardrails that never gives away direct answers.

---

## 🚀 Key Highlights

- **Pedagogical AI Tutor ("Pixel")**: Socratic AI guide that provides incremental hints (Levels 1–3), plain-English code explanations, and error diagnosis using relatable gaming analogies.
- **Strict Non-Spoil Guardrails**: Server-side system instructions and prompt engineering prevent the AI from generating copy-pasteable solutions, fostering genuine problem-solving.
- **Secure Server Proxy Layer**: Node.js/Express (`server.ts`) securely holds and manages external AI API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`). Secrets are never exposed to the client bundle.
- **Resilient Multi-Provider AI Architecture**: Seamlessly connects to Google Gemini or OpenAI, with an intelligent built-in Pedagogical Fallback Engine for zero-downtime offline demonstrations.
- **In-Browser Safe Code Runner**: Sandboxed JavaScript execution with real-time console capture, loop timeouts, and test assertion checks.
- **Arcade Gamification**: XP rewards, leveling progression, streak tracking, unlockable achievement trophies with celebratory confetti, and 8-bit retro Web Audio synth sound effects.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Modular Low-Overhead CSS, Lucide Icons, Canvas-Confetti, Web Audio API |
| **Backend** | Node.js (v22), Express, TypeScript (`tsx`), Zod (Strict Schema Validation), Rate Limiter |
| **AI Integration** | Google Gemini 2.5 / OpenAI GPT-4o-mini / Built-in Pedagogical Engine |
| **Deployment & Hosting**| Unified Single-Port Architecture (Express + Vite Middleware in Dev, Static SPA in Prod) |

---

## 📁 Scalable Project Structure

```text
Dev.--/
├── .env.example              # Environment variable template with security guidelines
├── .env                      # Local environment configuration
├── .gitignore                # Git exclusions (dist, node_modules, secrets)
├── metadata.json             # Manifest with capabilities and zero frame permissions
├── package.json              # Dependencies and development scripts
├── tsconfig.json             # Root TypeScript compiler options
├── tsconfig.node.json        # Vite config TypeScript options
├── vite.config.ts            # Vite bundler configuration & proxy settings
├── index.html                # HTML5 entrypoint with Google Fonts
├── ARCHITECTURE.md           # In-depth architectural design specification
├── README.md                 # Project documentation and user guide
├── public/
│   └── favicon.svg           # Custom retro arcade controller icon
├── server/
│   ├── server.ts             # Express application & Vite dev middleware integration
│   ├── config/
│   │   └── env.ts            # Validated environment configuration & safe public status
│   ├── controllers/
│   │   ├── ai.controller.ts  # Controller handling hints, explain, review, and chat
│   │   └── lesson.controller.ts # Controller for tracks and curriculum retrieval
│   ├── middleware/
│   │   ├── errorHandler.ts   # Global error handler with clean JSON responses
│   │   ├── rateLimiter.ts    # Anti-abuse rate limiter with standard HTTP headers
│   │   └── validate.ts       # Zod request validation middleware
│   ├── routes/
│   │   ├── ai.routes.ts      # AI proxy routes (/api/ai/*)
│   │   ├── health.routes.ts  # Health check & provider status (/api/health)
│   │   └── lesson.routes.ts  # Curriculum routes (/api/lessons/*)
│   └── services/
│       ├── ai/
│       │   ├── ai.service.ts # Unified AI service orchestrator
│       │   ├── gemini.provider.ts # Google Gemini integration with strict output parsing
│       │   ├── openai.provider.ts # OpenAI provider integration
│       │   ├── pedagogical.engine.ts # Context-aware fallback & offline pedagogical engine
│       │   ├── prompts.ts    # Socratic prompt engineering & system instructions
│       │   └── schemas.ts    # Zod schemas for AI requests and structured JSON responses
│       └── lesson.service.ts # Curriculum tracks, quests, and test suites
└── src/
    ├── main.tsx              # React DOM bootstrap
    ├── App.tsx               # Top-level state, view switcher, and notification modals
    ├── App.css               # Modular design system & arcade neon styling
    ├── api/
    │   ├── client.ts         # Typed fetch client using relative paths (/api)
    │   ├── ai.api.ts         # Frontend API calls for hints, explain, review, chat
    │   └── lesson.api.ts     # Frontend API calls for tracks and lessons
    ├── types/
    │   ├── ai.ts             # AI request and response interfaces
    │   ├── game.ts           # XP, streak, hearts, and badge definitions
    │   └── lesson.ts         # Lessons, test cases, and execution result types
    ├── utils/
    │   ├── codeSandbox.ts    # Sandboxed JS executor with loop timeout & test assertion
    │   ├── soundEffects.ts   # 8-bit retro arcade synth sounds via Web Audio API
    │   └── storage.ts        # LocalStorage persistence for user progress & drafts
    ├── hooks/
    │   ├── useAiTutor.ts     # Hook managing AI queries, hint caching, and chat history
    │   ├── useCodeRunner.ts  # Hook managing execution lifecycle and console state
    │   └── useGameState.ts   # Hook managing XP, levels, streaks, and badge unlocks
    └── components/
        ├── common/
        │   ├── Header.tsx     # Arcade status bar (Level, XP, Streak, Sound, AI Status)
        │   └── BadgeModal.tsx # Trophy celebration modal with confetti
        ├── curriculum/
        │   ├── QuestMap.tsx   # Interactive world map of tracks and stages
        │   └── BadgesView.tsx # Achievement showcase gallery
        ├── workspace/
        │   ├── Workspace.tsx  # Multi-pane coding arena
        │   ├── LessonBrief.tsx# Quest narrative, instructions, and checkpoints
        │   ├── CodeEditor.tsx # Code editor with line numbers, hotkeys, and tabs
        │   └── ConsoleOutput.tsx # Terminal console output & test result breakdown
        └── tutor/
            └── AiTutorPanel.tsx # "Pixel" AI Tutor dock (Hints, Explain, Review, Chat)
```

---

## ⚡ Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

To enable live Google Gemini responses, add your API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If left empty, CodeArcade immediately activates its built-in Intelligent Pedagogical Engine so all features work out-of-the-box without requiring an API key!)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 The Curriculum

CodeArcade includes 10 bite-sized beginner quests organized into 3 tracks:

1. **Track 1: Novice Grove (Fundamentals)**
   - Stage 1: *The Neon Console* (`console.log`, output strings)
   - Stage 2: *Inventory Chests* (Variables with `let` and `const`, data types)
   - Stage 3: *Power-Up Calculations* (Arithmetic operators, string concatenation)
   - Stage 4: *Party Roster Arrays* (Arrays, zero-indexing, `.push()`)

2. **Track 2: Cyber Dungeon (Logic & Control Flow)**
   - Stage 5: *Gatekeeper's Riddle* (`if` / `else` branching, strict equality `===`)
   - Stage 6: *The Double Shield* (Logical operators `&&` and `||`)
   - Stage 7: *Boss Combo Repeater* (`for` loops and iteration)

3. **Track 3: Arcade Citadel (Functions & Mini-Games)**
   - Stage 8: *Spellcasting Functions* (Function declarations, parameters, arguments)
   - Stage 9: *The Golden Return* (`return` values vs logging)
   - Stage 10: *The Grand Arcade Boss Battle* (Synthesizing variables, arrays, conditionals, and functions into a playable Mini-RPG combat calculator)

---

## 🤖 Pedagogical AI Tutor Features

- **3-Tier Socratic Hints**:
  - **Level 1 (Gentle Nudge)**: Conceptual framing and high-level guiding questions.
  - **Level 2 (Syntax Clue)**: Directs attention to specific keywords or line areas.
  - **Level 3 (Structural Pattern)**: Provides fill-in-the-blank pseudocode skeletons without giving the solution.
- **Line-by-Line Code Explainer**: Translates the student's code into plain English and intuitive game analogies.
- **Bug Review & Diagnosis**: Demystifies JavaScript runtime and syntax errors (e.g. `ReferenceError`, `undefined`) into actionable experiments.
- **Interactive Chat**: Conversational Q&A with Pixel that respects challenge guardrails and guides students to the "aha!" moment.

---

## 🛡️ Security & Client Isolation

1. **Server-Side Proxy**: Client code never communicates directly with Google Gemini or OpenAI. All requests route through `/api/ai/*`.
2. **Zero Client Secrets**: No environment variables with secret keys are exposed or prefixed with `VITE_`.
3. **Rate Limiting**: In-memory IP rate limiter defends backend AI endpoints against abuse and loops.
4. **Strict Schema Parsing**: Requests and LLM outputs are rigorously validated using Zod schemas with fallback sanitization.

---

## 📜 License
MIT License. Crafted for future coders everywhere.
