import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ReviewDto {

    @IsNotEmpty()
    @IsNumber()
    teacher_id: number

    @IsNotEmpty()
    @IsNumber()
    student_id: number

    @IsNotEmpty()
    @IsNumber()
    rating: number
}