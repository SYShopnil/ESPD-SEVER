import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GscService } from './gsc.service';
import { CreateGscDto } from './dto/create-gsc.dto';
import { UpdateGscDto } from './dto/update-gsc.dto';

import { google } from "googleapis";
import { JWT } from 'google-auth-library';
import * as credentials from './credentials.json';

type GEvent = {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  reminders: {
    useDefault: boolean;
    overrides: [{ method: 'popup' | 'email'; minutes: number }];
  };
  attendees: [{ email: string; comment: string }];
  sendUpdates: 'all' | 'externalOnly' | 'none';
};

@Controller('gsc')
export class GscController {
  constructor(private readonly gscService: GscService) { }

  @Post()
  async create(@Body() gEvent) {
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [ // set the right scope
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      subject: "hello@espd.school"
    });


    const calendar = google.calendar({ version: 'v3' });

    const nowData = new Date()

    const eventInfo = {
      summary: 'New Meeting event',
      description: 'Meeting with Doctor',
      start: {
        dateTime: nowData.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: nowData.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      conferenceData: {
        createRequest: {
          requestId: this.makeid(10),
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      attendees: [
        { email: 'shohag.rng@gmail.com' }
      ]

      // colorId: 3,
    }


    const res = await calendar.events.insert({
      calendarId: 'hello@espd.school',
      auth: client,
      requestBody: eventInfo,
      conferenceDataVersion: 1
    });



    console.log(res.data)

    return res.data.htmlLink;

    // return this.gscService.create(createGscDto);
  }

  makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

  @Get()
  findAll() {
    return this.gscService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gscService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGscDto: UpdateGscDto) {
    return this.gscService.update(+id, updateGscDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gscService.remove(+id);
  }
}
