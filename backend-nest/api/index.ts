import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { json, urlencoded } from 'express';

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

    app.use((req: any, res: any, next: any) => {
        if (req.url === '/' && req.method === 'GET') {
            return res.send({ status: 'ok', message: 'Backend is running on Vercel Serverless!' });
        }
        console.log(`[Vercel] ${req.method} ${req.url}`);
        next();
    });

    await app.init();
    cachedApp = app;
    return app;
}

export default async function handler(req: any, res: any) {
    await createNestApp();
    expressApp(req, res);
}
