import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';

const url =
  'mongodb+srv://exquis_user:GL96sl6ishfSb75u@auth-gateway-db.zfwyaux.mongodb.net/?retryWrites=true&w=majority&appName=auth-gateway-db';

@Module({
  imports: [
    MongooseModule.forRoot(url),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
