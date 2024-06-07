import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TutorFindDto {

    @IsNotEmpty()
    @IsNumber()
    subject_id: number;

    @IsNotEmpty()
    @IsNumber()
    level_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;


    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    phone: string;

}