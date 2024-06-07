import {Body, Controller, Post} from "@nestjs/common";
import {res} from "src/common/response.helper";
import {RequestOtpDto, ResetPasswordDto, ResetPasswordVerifyOtpDto} from "../dtos/request-otp.dto";
import {ResetPasswordService} from "../services/reset-password.service";

@Controller('reset-password')
export class ResetPasswordController {
    constructor(private resetPasswordService: ResetPasswordService) { }

    @Post('request-otp')
    async requestOtp(@Body() data : RequestOtpDto){
        const verify = await this.resetPasswordService.requestOtp(data)
        return res.success({}, "We sent an OTP code to your email")
    }

    @Post('verify-otp')
    async verifyOtp(@Body() data : ResetPasswordVerifyOtpDto){
        const verify = await this.resetPasswordService.verifyOtp(data)
        return res.success(verify, "OTP Verified")
    }

    @Post()
    async resetPassword(@Body() data : ResetPasswordDto){
        const verify = await this.resetPasswordService.resetPassword(data)
        return res.success(verify, "Password reset successful")
    }
}
