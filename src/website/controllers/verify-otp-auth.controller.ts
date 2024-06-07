import { Body, Controller, Post } from "@nestjs/common";
import { res } from "src/common/response.helper";

import { VerifyOtpDto } from "../dtos/verify-otp.dto";
import { VerifyOtpAuthService } from "../services/verify-otp-auth.service";

@Controller('auth/otp')
export class VerifyOtpAuthControlller {
    constructor(private otpAuthService: VerifyOtpAuthService) { }

    @Post('verify')
    async verifyOtp(@Body() data : VerifyOtpDto){
        const verify = await this.otpAuthService.verifyOtp(data)
        return res.success(verify, "Verify Success")
    }
}
