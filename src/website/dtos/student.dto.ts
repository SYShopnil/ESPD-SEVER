import { IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}


export class LoginStudent {
    @IsString()
    @IsNotEmpty()
    email: string


    @IsString()
    @IsNotEmpty()
    password: string
}


export class UpdateStudentInfo {

    @IsString()
    first_name?: string;

    @IsString()
    last_name?: string;

    @IsString()
    email?: string;

    @IsString()
    phone?: string;

    @IsString()
    profile_photo?: string;

    @IsString()
    address_line_1?: string;

    @IsString()
    address_line_2?: string;

    @IsString()
    city?: string;

    @IsString()
    postal_cdoe?: string;

    @IsString()
    country?: string;
}


export class UpdateStudentPassword {

    @IsNotEmpty()
    @IsString()
    new_password: string

}



