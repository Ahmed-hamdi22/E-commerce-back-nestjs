import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor() {
    // Seed default admin and standard user
    const salt = bcrypt.genSaltSync(10);
    this.users.push({
      id: 1,
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: bcrypt.hashSync('admin123', salt),
      role: UserRole.ADMIN,
      createdAt: new Date(),
    });

    this.users.push({
      id: 2,
      name: 'Standard Customer',
      email: 'user@ecommerce.com',
      password: bcrypt.hashSync('user123', salt),
      role: UserRole.USER,
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    const newUser: User = {
      id: this.users.length ? Math.max(...this.users.map((u) => u.id)) + 1 : 1,
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || UserRole.USER,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result;
  }
}
