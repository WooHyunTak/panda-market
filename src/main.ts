import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins: string[] = [
    'http://localhost:3001',
    'https://moving-fe-e1p7.vercel.app',
    'https://moving-fe-weld.vercel.app',
  ];
  // CORS 설정
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, origin?: string) => void,
    ) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // 허용
      } else {
        callback(new Error('Not allowed by CORS')); // 허용하지 않음
      }
    },
    exposedHeaders: ['set-cookie'],
  };

  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT ?? 3000}`),
  );
}
bootstrap();
