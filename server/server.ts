import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env';
import healthRoutes from './routes/health.routes';
import aiRoutes from './routes/ai.routes';
import lessonRoutes from './routes/lesson.routes';
import { errorHandler } from './middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function createServer() {
  const app = express();

  // Basic security and parsing middlewares
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/lessons', lessonRoutes);

  // Vite Integration (Dev Middleware vs Production Static Serving)
  if (env.nodeEnv !== 'production') {
    // Dynamic import to prevent bundler issues in production
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: projectRoot,
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      appType: 'spa',
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    // Fallback for HTML5 history API navigation
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(projectRoot, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production static serving
    const distPath = path.resolve(projectRoot, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn(`[Warning] Dist folder not found at ${distPath}. Run 'npm run build' first.`);
    }
  }

  // Global error handler
  app.use(errorHandler);

  return app;
}

async function start() {
  try {
    const app = await createServer();
    const port = env.port;
    const host = '0.0.0.0';

    const server = app.listen(port, host, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🕹️  CODEARCADE SERVER 🕹️                  ║
╠══════════════════════════════════════════════════════════════╣
║  Status:    ONLINE & READY                                   ║
║  Host:      http://${host}:${port}                             ║
║  API Base:  http://${host}:${port}/api                         ║
║  Health:    http://${host}:${port}/api/health                  ║
║  AI Engine: ${env.geminiApiKey ? 'Google Gemini (Live)' : env.openaiApiKey ? 'OpenAI (Live)' : 'Pedagogical Engine (Simulated)'}
║  Mode:      ${env.nodeEnv}                                      ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });

    const shutdown = () => {
      console.log('\n[CodeArcade] Shutting down gracefully...');
      server.close(() => {
        console.log('[CodeArcade] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('Failed to start CodeArcade server:', err);
    process.exit(1);
  }
}

// Auto-start when executed directly
const isDirectExecution =
  process.argv[1] &&
  (path.resolve(process.argv[1]) === __filename ||
    process.argv[1].endsWith('server.ts') ||
    process.argv[1].endsWith('server.js'));

if (isDirectExecution || !process.env.TEST_ENV) {
  start();
}

export { createServer };
