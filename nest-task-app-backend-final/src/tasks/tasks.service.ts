import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) { }
  async create(createTaskDto: CreateTaskDto, request: any): Promise<Task> {
    const user = request['user'];
    const userId = String(user.sub);
    console.log(userId);



    return this.taskRepository.save({
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed,
      user: {
        id: userId
      }
    })
  }

  async findAll(request: any): Promise<Task[]> {
    const user = request['user'];

    return this.taskRepository.find({
      where: {
        user: {
          id: String(user.sub)
        }
      },
      order: {
        id: "DESC"
      }
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    let task = await this.taskRepository.findOneBy({ id });
    console.log(task);

    if (!task) {
      return null;
    }
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.completed = updateTaskDto.completed
    return this.taskRepository.save(task);

  }

  async remove(id: number): Promise<boolean> {
    let task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      return false;
    }
    await this.taskRepository.remove(task);
    return true;
  }
}
