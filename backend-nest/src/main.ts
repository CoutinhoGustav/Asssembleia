import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization, x-auth-token',
    });

    app.use((req, res, next) => {
        if (req.url === '/' && req.method === 'GET') {
            return res.send({ status: 'ok', message: 'Backend is running' });
        }
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });

    await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
