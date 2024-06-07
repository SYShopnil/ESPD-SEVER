import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyOtpDto {

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsNumber()
    otp: number
}