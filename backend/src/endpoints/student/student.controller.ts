import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from 'src/dto/create_student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: Partial<CreateStudentDto>,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }
}
