import { Controller, Get, Req, UseGuards, Res, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SocialAuthService } from '../services/social-auth.service';
import { res } from 'src/common/response.helper';

@Controller('calendar')
export class GoogleCalendarController {
    constructor(private readonly socialService: SocialAuthService) { }


    /*
    * complete oauth for teachers to get access to their calendar
    * This endpoint is only for teachers
    * */
    @Get('google/redirect')
    @UseGuards(AuthGuard('google-calendar'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.socialService.saveTokens(req)
        // const student = await this.socialService.googleUser(user.user, "google")
        return res.redirect(`${process.env.WEBSITE_BASE_URL}/tutor-dashboard?page=statistics`)
    }

}
