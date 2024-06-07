import { Injectable } from '@nestjs/common';
import { AdminUser, Prisma, User } from "@prisma/client";
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async validateOldPassword(email: string, oldPass: string): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (user === null) return false;

    // const hash = bcryptjs.hashSync(oldPass.toString(), 10);

    const passwordValid = bcryptjs.compareSync(oldPass, user.password)

    return passwordValid;
  }

  async resetPassword(userId: number, newPass: string): Promise<any | null> {
    const hash = bcryptjs.hashSync(newPass.toString(), 10);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hash
      }
    });

    return user;
  }

  async getUserProfile(userId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }

  async getUserDetails(userId: number): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });


    return {
      user,
    }
  }

  async updateProfile(data: any, userId: number): Promise<User | null> {
    let payload: any = {};
    if(data.email) {
      payload['email'] = data.email;
    }
    if(data.password) {
      const hash = bcryptjs.hashSync(data.password, 10);
      payload['password'] = hash;
    }
    if(data.first_name) {
      payload['first_name'] = data.first_name;
    }
    if(data.profile_photo) {
      payload['profile_photo'] = data.profile_photo;
    }
    if(data.phone) {
      payload['phone'] = data.phone;
    }
    if(data.last_name) {
      payload['last_name'] = data.last_name;
    }
    if(data.push_token) {
      payload['push_token'] = data.push_token;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: payload
    });

    delete user['password'];

    return user;
  }
}
