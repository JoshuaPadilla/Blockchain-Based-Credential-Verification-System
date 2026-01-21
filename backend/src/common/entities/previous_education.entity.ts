import { Column, Entity } from 'typeorm';

@Entity()
export class PreviousEducation {
  @Column()
  schoolName: string;

  @Column()
  yearGraduated: number;
}
