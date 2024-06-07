import { PartialType } from '@nestjs/swagger';
import { CreateGscDto } from './create-gsc.dto';

export class UpdateGscDto extends PartialType(CreateGscDto) {}
