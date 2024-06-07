import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  Request,
  Post,
  UploadedFile, UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentsService } from "./attachments.service";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { res } from "../common/response.helper";
import { multerOptionsLocal } from "./utils/multerOptionsLocal";
import { multerOptionsAws } from "./utils/multerOptionsAws";



@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  

  /*
  * upload an image to S3 & return the rl
  * */
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file',
    process.env.NODE_ENV === 'development'
      ? multerOptionsLocal
      : multerOptionsAws))
  async uploadImage(@UploadedFile(
  ) file, @Body('name') name: string) {
    //for dev, upload the images on local file system
    if (process.env.NODE_ENV === 'development') {//TODO get env from config service
      return res.success({ url:  `${process.env.APP_URL}/uploads/${file.filename}`, name }, 'Success');
      //dont need to put `public` in the url
    } else {
      const uploaded: any = await this.attachmentsService.upload(file);
      if (uploaded) {
        return res.success({ url: uploaded?.Location, name }, 'Success');
      } else {
        return res.error('Failed to upload image');
      }
    }
  }

}
