import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Role} from "../../auth/dto/role.enum";

@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  signJwt({ email, phone, id }, role: string = Role.Student): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { email: email, id: id, phone: phone, role }
    return this.jwtService.sign(payload);
  }

  async verifyAsync(token) {
    const student = await this.jwtService.verifyAsync(token)
    return student
  }
}

