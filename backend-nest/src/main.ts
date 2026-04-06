import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization, x-auth-token, Bypass-Tunnel-Reminder, bypass-tunnel-reminder',
    });

    app.use((req: any, res: any, next: any) => {
        if (req.url === '/' && req.method === 'GET') {
            return res.send({ status: 'ok', message: 'Backend is running locally (Docker/Node)' });
        }
        console.log(`[Local] ${req.method} ${req.url}`);
        next();
    });

    const port = process.env.PORT ?? 3002;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
