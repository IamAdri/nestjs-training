import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Add middlewares
  appCreate(app);
  await app.listen(process.env.PORT ?? 3000);
  //console.log(app);
  console.log('DB_PASSWORD din ENV este:', process.env.DB_PASSWORD);
console.log('DB_PORT din ENV este:', process.env.DB_PORT);
}
bootstrap();
