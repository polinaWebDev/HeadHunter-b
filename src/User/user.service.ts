import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../Auth/dto/register.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

  async createUser(data: RegisterDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

    async findById(id: number): Promise<User | null> {
      return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
      return this.userRepository.findOne({ where: { email } });
    }

}

