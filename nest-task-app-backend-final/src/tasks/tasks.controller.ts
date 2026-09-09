import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { UsersGuard } from '../users/users.guard.js';


@Controller('tasks')
 @UseGuards(UsersGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
 
  create(@Body() createTaskDto: CreateTaskDto, @Req() request : any) {
    return this.tasksService.create(createTaskDto, request);
  }

  @Get()
  findAll(@Req() request : any) {
    return this.tasksService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
