import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module.js';
import { Task } from './tasks/entities/task.entity.js';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/entities/user.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'admin123',
      username: 'postgres',
      entities: [Task,User], 
      database: 'taskapp',
      synchronize: true,
      logging: true,
    }),
     TasksModule,
     AuthModule,
     UsersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
