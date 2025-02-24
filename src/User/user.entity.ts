import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileType } from '../types/ProfileType';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'user`s ID',
    type: 'number',
    example: '10',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'user`s email',
    type: 'string',
    example: 'test@email.com',
  })
  @Column({unique:true})
  email: string;

  @ApiProperty({
    description: 'user`s password',
    type: 'string',
    example: '123',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'user`s firstname',
    type: 'string',
    example: 'John',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'user`s lastname',
    type: 'string',
    example: 'Doe',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'user`s profile type',
    type: 'string',
    example: 'employer',
  })
  @Column({type: 'enum',  enum: ProfileType})
  profile_type: ProfileType;

  @ApiProperty({
    description: 'user`s avatar',
    example: '-',
  })
  @Column({nullable: true})
  avatar_url?: string;
}