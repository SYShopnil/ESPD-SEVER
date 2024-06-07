import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { VerifyOtpDto } from "../dtos/verify-otp.dto";
import { JwtSignService } from "./jwt.sign.service";
import {ROLE_STUDENT} from "../../common/constants";


@Injectable()
export class VerifyOtpAuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtSignService: JwtSignService
    ) { }

    async verifyOtp(info: VerifyOtpDto) {
        const data = {
            is_verified: false
        }
        const response = await this.prismaService.otpVerification.findFirst({ where: { email: info.email, otp: info.otp } })
        if (response === null) {
            throw new HttpException("is Not valid Otp", HttpStatus.NOT_ACCEPTABLE)
        }

        data.is_verified = true

        const student = await this.prismaService.student.update({
            where: { email: response.email },
            data
        })

        await this.prismaService.otpVerification.delete({ where: { id: response.id, email: response.email } })

        const access_token = this.jwtSignService.signJwt({ email: student.email, phone: student.phone, id: student.id });
        delete student['password'];
        return {
            ...student,
            access_token,
            role: ROLE_STUDENT
        };
    }

}
