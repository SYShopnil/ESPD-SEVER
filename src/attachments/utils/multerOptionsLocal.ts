import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs-extra';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  dest: './public/uploads'/*process.env.UPLOAD_LOCATION*/,
};

// Multer upload options
export const multerOptionsLocal = {
  // Enable file size limits
  /*limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },*/
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    // console.log('fileFilter', file);
    // console.log('fileFilter mimetype', file.mimetype);
    cb(null, true);
    /*if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi|wmv|mov|webm)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      console.log('reject');
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_GATEWAY), false);
    }*/
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // console.log({uploadPath});
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // console.log('filename', file);
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
