import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  async findOne(id: string): Promise<User> {
    return this.findById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, salt) : '';
    
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    } as User);
    
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
  
  async search(query: string): Promise<User[]> {
    const logger = new Logger('UsersService');
    logger.log(`Searching users with query: ${query}`);
    
    try {
      // Create query builder
      const queryBuilder = this.usersRepository.createQueryBuilder('user');
      
      // Add search conditions
      queryBuilder.where(
        'user.username LIKE :query OR user.email LIKE :query',
        { query: `%${query}%` }
      );
      
      return queryBuilder.getMany();
    } catch (error) {
      logger.error(`Error searching users: ${error.message}`);
      return [];
    }
  }
}
