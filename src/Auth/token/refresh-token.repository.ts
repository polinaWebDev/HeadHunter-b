import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>
  ) {}

  async saveRefreshToken(userId: number, token: string) {
    await this.refreshTokenRepo.save({ userId, token });
  }

  async validateRefreshToken(userId: number, token: string): Promise<boolean> {
    const found = await this.refreshTokenRepo.findOne({ where: { userId, token } });
    return !!found;
  }

  async deleteRefreshToken(userId: number) {
    await this.refreshTokenRepo.delete({ userId });
  }

}
