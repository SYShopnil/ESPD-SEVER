import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import { res } from "../common/response.helper";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdatePasswordDto } from "./dto/updatePasswordDto";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserProfile(@Request() req) {
    const user = await this.usersService.getUserProfile(req?.user?.id);
    return res.success(user, 'Success');
  }

  @Post('update-profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    const user = req.user;
    const id = +user.id
    const data = await this.usersService.updateProfile(updateProfileDto, id)
    return res.success(data, 'Profile updated');
  }

  @Post('update-password')
  async updatePassword(@Request() req, @Body() payload: UpdatePasswordDto) {
    const email = req.user.email;
    const isVerified = await this.usersService.validateOldPassword(email, payload.old_password);
    if (!isVerified) {
      throw new HttpException('Old password doesn\'t match', HttpStatus.BAD_REQUEST);
    }
    const data = await this.usersService.resetPassword(+req?.user?.id, payload.new_password);
    return res.success(data, 'password changed successfully');
  }

}
