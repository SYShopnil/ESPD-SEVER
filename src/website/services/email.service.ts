// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { createTransport } from 'nodemailer';
// import * as Mail from 'nodemailer/lib/mailer';
// import * as SendGrid from '@sendgrid/mail';


// @Injectable()
// export default class EmailService {
//   private nodemailerTransport: Mail;

//   constructor(private readonly configService: ConfigService) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     this.nodemailerTransport = createTransport({
//       service: 'Gmail',
//       // host: 'smtp.sendgrid.net',
//       port: 587,
//       /* auth: {
//         user: configService.get<string>('gmail_user'),
//         pass: configService.get<string>('gmail_app_password'),
//       },*/
//       auth: {
//         user: process.env.SENDER_EMAIL,
//         pass: process.env.SENDER_PASSWORD,
//       },
//       //   logger: true,
//       //   debug: true,
//     });
//   }


  // sendMail(otp: number, email: string) {
  //   return this.nodemailerTransport.sendMail({
  //     // to: email,
  //     to: email,
  //     from: process.env.SENDER_EMAIL,
  //     subject: 'Otp Verification from espd',
  //     text: `Welcome to ESPD. Your verification code is ${otp}`,
  //     html: `<h3>${otp}</h3>`,
  //   })
  // }


  // sendMailMessage(email: string, message: string, free_call, contact_email: string) {
  //   const email_send = this.nodemailerTransport.sendMail({
  //     to: email,
  //     from: process.env.SENDER_EMAIL,
  //     subject: `Contact with Teacher`,
  //     text: `${message}`,
  //     html: `<h3 style="text-align:center;">I’d like a free video chat with the teacher ? </br> <p style="text-align:center;">
  //     ${free_call ? "Yes" : "No"}
  //     </p> </h3>
  //     <div>
  //       <h3 style="margin:0;">
  //       => Would you want contact with me?
  //       </h3>
  //       <p style="margin:0;">
  //       => Contact Me : ${contact_email}
  //       </p>
  //     </div>
      
  //     `
  //   })
  //   if (email_send.rejected?.length === 0 && email_send.rejected === undefined && email_send.rejected === null) {
  //     return { send_message: false }
  //   }
  //   return { send_message: true }
  // }
// }
