import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageDto {

    @IsNotEmpty()
    @IsNumber()
    teacher_id: number

    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    @IsString()
    contact_email: string

    @IsNotEmpty()
    @IsNumber()
    exam_board_id: number
    free_video_chat
}