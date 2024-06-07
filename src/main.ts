/* eslint-disable */
import { config } from 'dotenv';
config();
import { join } from 'path';

import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import { PrismaClientValidationExceptionFilter } from "./prisma-client-exception/prisma-client-validation-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from '@nestjs/common';

const cloneBuffer = require('clone-buffer');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  const options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.enableCors(options);
  app.setGlobalPrefix('api/v1');

  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('Trace API')
    .setDescription('description')
    .setVersion('1.0.0')
    .addTag('trace')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new PrismaClientValidationExceptionFilter(httpAdapter));

  /* to make stripe webhook raw body parsing work*/
  //https://yanndanthu.github.io/2019/07/04/Checking-Stripe-Webhook-Signatures-from-NestJS.html
  app.use(json({
    verify: (req: any, res, buf, encoding) => {
      // important to store rawBody for Stripe signature verification
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
        req.rawBody = cloneBuffer(buf);
      }
      return true;
    },
  }));
  /*end*/

  const PORT = process.env.PORT || 80;
  await app.listen(PORT);
}
bootstrap();
