import { IsNotEmpty, IsNumber } from "class-validator"

export class FavouriteDto {

    @IsNotEmpty()
    @IsNumber()
    student_id: number

    @IsNotEmpty()
    @IsNumber()
    teacher_id: number

    

}