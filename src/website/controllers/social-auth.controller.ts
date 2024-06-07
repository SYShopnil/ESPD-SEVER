import { Controller, Get, Req, UseGuards, Res, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SocialAuthService } from '../services/social-auth.service';
import { res } from 'src/common/response.helper';

@Controller('auth')
export class SocialAuthController {
    constructor(private readonly socialService: SocialAuthService) { }


    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.socialService.loginValidation(req)
        const student = await this.socialService.googleUser(user.user, "google")
        return res.redirect(`${process.env.WEBSITE_BASE_URL}/login?role=student&accessToken=${student.access_token}`)
    }


    @Get('facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req, @Res() res) {
        const user = await this.socialService.loginValidation(req)
        const student = await this.socialService.facebookUser(user.user, "facebook")
        return res.redirect(`${process.env.WEBSITE_BASE_URL}/login?role=student&accessToken=${student.access_token}`)
    }


    @Get('apple/redirec')
    @UseGuards(AuthGuard('apple'))
    async appleAuthRedirect(@Req() req) {

    }

    @Get('social/validation')
    async valideTionUser(@Query('accessToken') accessToken: String) {
        const student = await this.socialService.valideTionUser(accessToken);
        return res.success(student, "valid user")
    }

}