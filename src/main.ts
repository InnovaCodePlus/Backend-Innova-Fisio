import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS Configuration
    app.enableCors({
        origin: '*',
        // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        // allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api');

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
