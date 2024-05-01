import * as bcrypt from 'bcrypt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Método para iniciar sesión
  async login(username: string, password: string): Promise<{accessToken: string, refreshToken: string}> {
    
    const user = await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
    });
    if (!user || !user.password || !password || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (
      !user.password ||
      !password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    
    // La contraseña coincide
  const accessToken = jwt.sign({ userId: user.idUser }, 'access-token-secret', { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.idUser }, 'refresh-token-secret', { expiresIn: '7d' });

  return { accessToken, refreshToken };
  }

  // Método para refrescar el token
  async refreshToken(refreshToken: string): Promise<{accessToken: string}> {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await this.userRepository.findOne(payload.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const accessToken = jwt.sign({ userId: user.idUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      return { accessToken };
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async onModuleInit(): Promise<void> {
    try {
      dotenv.config();
    } catch (error) {
      console.log('Error al cargar las variables de entorno');
    }
    let adminUser = await this.userRepository.findOne({
      where: { username: 'admin' },
    });
    if (!adminUser) {
      adminUser = new User();
      adminUser.username = process.env.ADMIN_USERNAME;
      adminUser.email = process.env.ADMIN_EMAIL;
      adminUser.nombre = process.env.ADMIN_NAME;
      adminUser.apellido = process.env.ADMIN_LASTNAME;
    }
    const salt = await bcrypt.genSalt();
    if (process.env.ADMIN_PASSWORD) {
      adminUser.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      await this.userRepository.save(adminUser);
    } else {
      throw new Error('ADMIN_PASSWORD is not defined');
    }
  }
}
