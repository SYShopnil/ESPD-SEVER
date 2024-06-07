import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from './dto/role.enum';

@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  signJwt(user: any, role: string = Role.User): string {
    return this.jwtService.sign({ email: user.email, id: user.id, sub: user.id, role });
  }

}

