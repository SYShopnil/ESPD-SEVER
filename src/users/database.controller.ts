import { Controller, Get } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, createWriteStream } from 'fs';
import { exec } from 'child_process';
// import * as pgPromise from 'pg-promise';
// const pgPromise = require('pg-promise')();

@Controller('database')
export class DatabaseController {
  // private readonly pgp: pgPromise.IMain;
  // private readonly db: any;

  constructor() {
    // Configure pg-promise with your PostgreSQL connection details
    /*this.pgp = pgPromise({});
    this.db = this.pgp({
      host: 'espd-db',
      port: 5432,
      database: 'espd',
      user: 'postgres',
      password: '1234',
    });*/
  }

  @Get('backup')
  async backupDatabase(res: Response) {
    try {
      const backupFileName = 'backup.sql';

      // Use pg_dump command to create a database backup
      exec(
          `pg_dump -h espd-db -U postgres espd -f ${backupFileName}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error('Error during database backup:', error);
              res.status(500).json({ message: 'Database backup failed' });
              return;
            }

            // Send the backup file as a response
            res.header('Content-Disposition', `attachment; filename=${backupFileName}`);
            res.header('Content-Type', 'application/octet-stream');
            const fileStream = createReadStream(backupFileName);
            fileStream.pipe(res);
          }
      );
    } catch (error) {
      console.error('Error during database backup:', error);
      res.status(500).json({ message: 'Database backup failed' });
    }
  }
}
