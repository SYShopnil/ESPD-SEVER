import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { isStringObject } from 'util/types';

export class BookingDtoSingle {

    @IsNotEmpty()
    @IsNumber()
    student_id: number


    @IsNotEmpty()
    @IsNumber()
    teacher_id: number

    @IsNotEmpty()
    amount: number

    @IsNotEmpty()
    level_id: number

    @IsNotEmpty()
    duration: number
}


export class BookingDtoGroup {

    @IsNotEmpty()
    @IsNumber()
    student_id: number


    @IsNotEmpty()
    @IsNumber()
    teacher_id: number


    @IsNotEmpty()
    @IsNumber()
    no_of_member: number

    @IsNotEmpty()
    amount: number

    @IsNotEmpty()
    level_id: number

    token: string
    booking_type

    @IsNotEmpty()
    duration: number

    @IsNotEmpty()
    start_time: string
}
