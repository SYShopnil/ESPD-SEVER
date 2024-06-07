import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
const SendGrid = require('@sendgrid/mail')

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: 'Gmail',
      // host: 'smtp.sendgrid.net',
      port: 587,
      /*auth: {
        user: configService.get<string>('gmail_user'),
        pass: configService.get<string>('gmail_app_password'),
      },*/
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      //   logger: true,
      //   debug: true,
    });
    SendGrid.setApiKey(process.env.SENDGRID_KEY)
  }

  // sendMail(options: Mail.Options) {
  //   return this.nodemailerTransport.sendMail(options);
  // }

  // sendMail(mail: SendGrid.MailDataRequired) {
  //   return SendGrid.send(mail);
  // }


  sendMail(otp: number, email: string) {
    const mail = {
      // to: email,
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Otp Verification from espd',
      text: `Welcome to ESPD. Your verification code is ${otp}`,
      html: `<h3>${otp}</h3>`,
    };
    return SendGrid.send(mail)
  }

  sendMailReset(mail) {
    return SendGrid.send(mail)
  }


  async sendMailMessage(email: string, message: string, free_call, contact_email: string) {
    const email_send = await SendGrid.send({
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: `Contact with Teacher`,
      text: `${message}`,
      html: `<h3 style="text-align:center;">I’d like a free video chat with the teacher ? </br> <p style="text-align:center;">
      ${free_call ? "Yes" : "No"}
      </p> </h3>
      <div>
        <h3 style="margin:0;">
        => Would you want contact with me?
        </h3>
        <p style="margin:0;">
        => Contact Me : ${contact_email}
        </p>
      </div>
      
      `
    })
    return { send_message: true }
  }

  async sendEmail(to_email: string, subject:string , text: string, html = null) {

    const payload: any = {
      to: to_email,
      from: process.env.SENDER_EMAIL,
      subject: subject,
      text: text
    }
    if (html) {
      payload.html = html
    }

    //send with sendgrid
    // const email_send = await SendGrid.send(payload)

    //send via gmail
    return this.nodemailerTransport.sendMail(payload);
    return { send_message: true }
  }




}
