# 🏛️ CodeArcade System Architecture

## 1. Executive Summary & Core Design Principles

**CodeArcade** is a production-grade, interactive web platform designed to introduce absolute beginners to software development through gamification, sandboxed code execution, and a dedicated Socratic AI tutor named **Pixel**.

### Core Architecture Pillars:
1. **Pedagogical Integrity**: AI assistance must never solve challenges for the student. It must scaffold learning through Socratic questioning, relatable analogies, and 3-tiered incremental hints.
2. **Strict Server-Side Security**: External AI credentials (Google Gemini / OpenAI) are quarantined on the server. The client communicates exclusively through authenticated, rate-limited proxy endpoints (`/api/ai/*`).
3. **Resilience & High Availability**: The platform operates seamlessly regardless of whether an external API key is provided, leveraging a deterministic AST-patterned Pedagogical Fallback Engine.
4. **Low-Overhead High-Performance Frontend**: Zero heavy CSS frameworks. Modular CSS variables provide dark/neon arcade themes with sub-millisecond layout calculations.
5. **Safe In-Browser Execution**: Learner code executes in an isolated sandbox with loop termination safeguards and test assertions.

---

## 2. Container & Component Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   Client Browser                       │
                    │  ┌──────────────────────────────────────────────────┐  │
                    │  │      React 18 + Vite (TypeScript Application)     │  │
                    │  │  - Quest Map / Curriculum Track Selector         │  │
                    │  │  - Interactive Code Editor (Hotkeys, Tabs)       │  │
                    │  │  - Sandboxed JS Runner (Safe eval + Test Suite)  │  │
                    │  │  - Web Audio 8-bit Synth (Chimes, Fans, Blips)   │  │
                    │  │  - Pixel AI Tutor Dock (Hints, Review, Chat)     │  │
                    │  └─────────────────────────┬────────────────────────┘  │
                    └────────────────────────────┼───────────────────────────┘
                                                 │ HTTP / Relative API Calls
                                                 │ (/api/*)
                    ┌────────────────────────────▼───────────────────────────┐
                    │            Node.js / Express Proxy Layer               │
                    │  ┌──────────────────────────────────────────────────┐  │
                    │  │  Middleware Pipeline:                             │  │
                    │  │  - CORS & Security Headers                       │  │
                    │  │  - In-Memory IP Rate Limiter (60 req/min)        │  │
                    │  │  - Zod Request Schema Validation                 │  │
                    │  └─────────────────────────┬────────────────────────┘  │
                    │                            │                           │
                    │  ┌─────────────────────────▼────────────────────────┐  │
                    │  │  API Route Controllers                           │  │
                    │  │  - /api/health   - /api/lessons  - /api/ai       │  │
                    │  └─────────────────────────┬────────────────────────┘  │
                    │                            │                           │
                    │  ┌─────────────────────────▼────────────────────────┐  │
                    │  │  Unified AI Service Orchestrator                 │  │
                    │  │  - Socratic Prompt Builder                       │  │
                    │  │  - Strict Output Parsing & Markdown Sanitizer    │  │
                    │  │  - Graceful Fallback Strategy                    │  │
                    │  └────────┬─────────────────────────┬───────────────┘  │
                    └───────────┼─────────────────────────┼──────────────────┘
                                │                         │
           ┌────────────────────▼─────────┐      ┌────────▼───────────────────────┐
           │   External AI Providers      │      │  Built-in Pedagogical Engine   │
           │  - Google Gemini 2.5 Flash   │      │  - AST & Regex Code Inspector  │
           │  - OpenAI GPT-4o-mini        │      │  - Deterministic 3-Tier Hints  │
           │  (Authenticated via Secrets) │      │  - Instant Zero-Key Execution  │
           └──────────────────────────────┘      └────────────────────────────────┘
```

---

## 3. Pedagogical AI Tutor ("Pixel") Architecture

### 3.1 Socratic Hint Tiers
To prevent cognitive overload while preserving active learning, hints are structured in 3 progressive tiers:

- **Level 1 (Gentle Conceptual Nudge)**:
  - Focuses solely on the high-level objective and computational thinking concept.
  - Asks a guiding question to prompt self-reflection.
  - Uses an arcade/gaming analogy (e.g. inventory slots for variables, combo recipes for functions).
  - Explicitly forbids code snippets.

- **Level 2 (Targeted Syntax & Area Clue)**:
  - Directs the learner's attention to the specific line or keyword needing adjustment.
  - Explains syntax rules (e.g., quotes around strings, parentheses after functions).
  - Flags potential typos, casing mismatches, or missing semicolons.

- **Level 3 (Structural Pattern / Pseudocode)**:
  - Provides a fill-in-the-blank skeleton or pseudocode pattern.
  - Leaves the challenge-specific values blank so the learner must complete the synthesis.

### 3.2 Strict Output Parsing & JSON Schemas
LLM providers can be nondeterministic. The backend enforces structured outputs via:
1. `responseMimeType: "application/json"` (Gemini) / `response_format: { type: "json_object" }` (OpenAI).
2. Sanitization filters that strip triple backticks (````json ... ````).
3. Runtime validation via Zod schemas:
   - `HintResponseSchema`
   - `ExplainResponseSchema`
   - `ReviewResponseSchema`
   - `ChatResponseSchema`
4. Automatic fallback: If an external provider returns malformed JSON or encounters upstream rate limits, the orchestrator seamlessly routes the request to the deterministic `PedagogicalEngine`.

---

## 4. In-Browser Code Sandboxing & Test Harness

Beginner code frequently produces runtime errors or accidental infinite loops (e.g. `while(true)`).

### Sandbox Implementation:
- User code is executed inside a scoped `Function` context.
- `console.log`, `info`, `warn`, and `error` are intercepted to capture output into an array of formatted strings.
- A `Promise.race` enforces an execution timeout of 2000ms.
- Test assertions evaluate against both global scope variables and console outputs.
- Test results are returned to the client as typed structures:
  `{ success: boolean, logs: string[], testResults: TestResult[], error?: string, executionTimeMs: number }`.

---

## 5. Security & Client Isolation

| Risk | Mitigation Strategy |
| :--- | :--- |
| **API Key Theft** | External keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) reside exclusively in server memory via `dotenv`. No client build files or Vite bundle artifacts ever reference secret keys. |
| **API Denial-of-Service / Abuse** | In-memory IP-based rate limiting (`rateLimiter.ts`) restricts requests to 60 calls per minute per IP, returning HTTP 429 with reset headers. |
| **Malformed Client Payloads** | Express routes validate incoming JSON bodies against strict Zod schemas (`HintRequestSchema`, `ExplainRequestSchema`, etc.) before forwarding to providers. |
| **Infinite Loops in Learner Code** | Execution timeout aborts long-running learner scripts at 2000ms. |

---

## 6. Hosting & Preview Compatibility

CodeArcade runs as a unified single-port server:
- In **development**, Express embeds Vite in middleware mode (`vite.createServer({ server: { middlewareMode: true } })`). A single process at `0.0.0.0:3000` serves both the API routes and the hot-reloading React application.
- In **production**, Express serves static production assets from `dist/` with an SPA HTML5 fallback handler.
- Dev server settings enable `allowedHosts: true`, ensuring proxy tunnels (e.g., `*.e2b.app`) work without host header rejections.
