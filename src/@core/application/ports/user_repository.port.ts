import { UserEntity } from 'src/@core/domain/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
}
