import { IsNotEmpty, IsString } from "class-validator";

export class RegisterTeacherDto {
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


export class LoginTeacher {
        @IsString()
        @IsNotEmpty()
        email: string


        @IsString()
        @IsNotEmpty()
        password: string
}



export class UpdateTeacherPassword {

        @IsNotEmpty()
        @IsString()
        new_password: string

}