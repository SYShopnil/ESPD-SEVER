import { IsNotEmpty, IsString } from 'class-validator';

export class AdminPasswordChangeDto {
    @IsString()
    @IsNotEmpty()
    new_password: string
    
    @IsString()
    @IsNotEmpty()
    email: string
    
}
