import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createLogger, format, transports } from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    defaultMeta: { service: 'App' },
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.Console({ level: 'error', format: format.combine(format.colorize(), format.simple()) }),
      new transports.File({ filename: 'combined.log' }),
    ]
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Shop')
    .setDescription('The shop API description')
    .setVersion('1.0')
    .addTag('shop')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
