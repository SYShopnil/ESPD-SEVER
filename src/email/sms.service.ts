import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


@Injectable()
export default class SmsService {
  constructor(private readonly configService: ConfigService) {

  }

  sendSMS(phone, text) {
    client.messages
      .create({
        body: text,
        // from: process.env.SEND_SMS_FROM,
        from: "ESPD",
        to: phone,
      })
      .then(message => console.log(`sms sent: ${message.sid}, to: ${phone}`))
      .catch(err => console.log('Error sending sms', err))
  }
}
