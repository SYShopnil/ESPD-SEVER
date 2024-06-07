import { IsNotEmpty, IsString } from 'class-validator';



export class createTeacherRequestDto {
    id: number;


    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    token: string;

    @IsString()
    @IsString()
    @IsNotEmpty()
    experience: string

}
