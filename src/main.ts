import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Strip properties that are not in the DTO
      whitelist: true,
      // Throw an error if non-whitelisted properties are present
      forbidNonWhitelisted: true,
      // Automatically transform payloads to DTO instances
      transform: true,
      // Enable implicit type conversion for query parameters
      // transformOptions: {
      //    enableImplicitConversion: true,
      //  },
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  //Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  //Setup the aws sdk used uploading the fikles to aws S3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });
  //enable cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  //console.log(app);
}
bootstrap();
