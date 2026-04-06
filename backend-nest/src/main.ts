import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();

let cachedApp: any;

async function createNestApp() {
    if (cachedApp) return cachedApp;

    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization, x-auth-token, Bypass-Tunnel-Reminder, bypass-tunnel-reminder',
    });

    app.use((req, res, next) => {
        if (req.url === '/' && req.method === 'GET') {
            return res.send({ status: 'ok', message: 'Backend is running' });
        }
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });

    await app.init();
    cachedApp = app;
    return app;
}

// ─── Vercel Serverless Handler ─────────────────────────────────
// A Vercel importa este handler e chama a cada request
export default async function handler(req: any, res: any) {
    await createNestApp();
    expressApp(req, res);
}

// ─── Standalone Server (Docker / Local) ────────────────────────
// Só executa quando rodado diretamente (não na Vercel)
async function bootstrap() {
    const app = await createNestApp();
    const port = process.env.PORT ?? 3002;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}

// Na Vercel, o módulo é importado como handler — não chama bootstrap().
// Localmente / Docker, rodamos o bootstrap().
if (process.env.VERCEL !== '1') {
    bootstrap();
}
