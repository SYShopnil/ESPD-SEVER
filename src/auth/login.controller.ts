import { Body, Controller, Get, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { res } from '../common/response.helper';
import { LoginService } from './login.service';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
  ) {}

  /*@UseGuards(LocalAuthGuard)*/
  @Post('login')
  async login(@Request() req, @Body() payload: LoginUserDto) {
    const isValid = await this.loginService.verifyPhoneNumber(payload.phone, payload.idToken);
    if (!isValid) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }
    const data = await this.loginService.loginUser(payload.phone);
    if (!data) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return res.success(data, 'User login successful');
  }


}
