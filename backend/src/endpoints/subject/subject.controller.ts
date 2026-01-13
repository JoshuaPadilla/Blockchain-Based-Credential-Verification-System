import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from 'src/dto/create_subject.dto';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async findall() {
    return this.subjectService.findall();
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: Partial<CreateSubjectDto>,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }
}
