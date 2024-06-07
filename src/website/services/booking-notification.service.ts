import {PrismaService} from '../../prisma/prisma.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import EmailService from "../../email/email.service";
import SmsService from '../../email/sms.service';
import {BookingTypes} from '@prisma/client';
import {DateTime} from "luxon";

@Injectable()
export class BookingNotificationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService,
        private readonly smsService: SmsService,
    ) { }



    async notifyAfterBooking(booking_id, notify_teacher: boolean, notify_student: boolean) {

        const booking = await this.prismaService.booking.findFirst({
            where: { id: Number(booking_id) },
            include: {
                Teacher: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                        phone: true
                    }
                },
                Student: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                        phone: true
                    }
                },
                Subject: true,
                Level: true,
                ExamBoard: true
            }
        });

        if (booking === null) {
            throw new HttpException("booking not found", HttpStatus.NOT_FOUND)
        }

        const settings = await this.prismaService.setting.findMany();
        const settingsObj = {};
        settings?.map(item => settingsObj[item?.key] = item?.value);

        if (notify_student) {
            await this.notifyStudentAfterBooking(booking, settingsObj);
        }

        if (notify_teacher) {
            await this.notifyTeacherAfterBooking(booking, settingsObj);
        }
    }

    async notifyStudentAfterBooking(booking, settings) {
        const student_html = ` 
        <div style="background-color: #ffffff; padding: 20px; margin: 20px;">
            <h1>Hello ${booking?.Student?.first_name + " " + booking?.Student?.last_name},</h1>
            <p>Thank you for booking with ESPD! Here are the details of your tutorial:</p>
            <p>Subject: ${booking?.Subject?.name}</p>
            <p>Level:</strong> ${booking?.Level?.name}</p>
            <p>Exam board:</strong>  ${booking?.ExamBoard?.name}</p>
            <p>Time:</strong>  ${this.formatDate(booking?.start_time)} ${this.formatDate(booking?.start_time, undefined, 'hh:mm a')}</p>
            <p>Booking Type:</strong> ${booking?.booking_type === BookingTypes.One_To_Group ? "Group" : 'One-to-One'}</p>
            <p>Expected Number of Students:</strong> ${booking?.no_of_member}</p>
            <p>Name:</strong> ${booking?.Student?.first_name + " " + booking?.Student?.last_name}</p>
            <p>Email:</strong> ${booking?.Student?.email}</p>
            <p>If this is your first booking, our fully qualified and experienced tutor will send you a courtesy email soon to confirm that they have received your booking and are ready to support you or your child in achieving their exam success goals.</p>
            <p>This booking will now appear on your dashboard. We kindly ask you to click the provided link to launch Google Meet and begin the lesson at the scheduled time of ${booking?.start_time}.</p>
            <p>Thank you once again for choosing ESPD. We hope you enjoy your tutorial. If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            <p>Best regards,<br>ESPD Team</p>
            <div>
                <img src="${settings?.brand_image}" alt="ESPD" style="max-width:250px;">
            </div>
            <div>
                <a href="${process.env.WEBSITE_BASE_URL}" style="display:block; font-weight:bold;">Website</a>
                <a href="${settings?.facebook}" style="display:block; font-weight:bold;">Facebook</a>
                <a href="${settings?.instagram}" style="display:block; font-weight:bold;">Instagram</a>
                <a href="${settings?.youtube}" style="display:block; font-weight:bold;">Youtube</a>
                <a href="${settings?.tiktok}" style="display:block; font-weight:bold;">Tiktok</a>
                <a href="${settings?.linkedin}" style="display:block; font-weight:bold;">Linkedin</a>

            </div>
        </div>
        `

        await this.emailService.sendEmail(booking?.Student?.email, 'ESPD - Booking Lessons ', "", student_html);
        await this.smsService.sendSMS(booking?.Student?.phone, `Congratulations, your booking has been confirmed! Your tutorial will start at ${booking?.start_time}. Best wishes, The ESPD Team`);
        return booking
    }

    private formatDate (date, tz = 'Etc/UTC', format = 'dd MMM, yyyy') {
        if (date === null || date === undefined || date === '' ) return '';

        const iso = date.toISOString()
        return DateTime.fromISO(iso).setZone(tz).toFormat(format);
    }

    async notifyTeacherAfterBooking(booking, settings) {
        const teacher_html = ` 
            <div style="background-color: #ffffff; padding: 20px; margin: 20px;">
                <h1>Hello ${booking?.Teacher?.first_name + " " + booking?.Teacher?.last_name},</h1>
                <p>You have a new booking! Here are the details:</p>
                <p>Subject: ${booking?.Subject?.name}</p>
                <p>Level:</strong> ${booking?.Level?.name}</p>
                <p>Exam board:</strong>  ${booking?.ExamBoard?.name}</p>
                <p>Booking Type:</strong> ${booking?.booking_type === BookingTypes.One_To_Group ? "Group" : 'One to one'}</p>
                <p>Lesson start at:</strong> ${new Date(booking?.start_time)}</p>
                <p>Expected Number of Students:</strong> ${booking?.no_of_member}</p>
                <p>Name:</strong> ${booking?.Student?.first_name + " " + booking?.Student?.last_name}</p>
                <p>Email:</strong> ${booking?.Student?.email}</p>
                <p>Please send a courtesy email now to ${booking?.Student?.email} from your ESPD email address to confirm with the student/parent that you have received the booking and are looking forward to meeting with them and supporting them with their exam success goals. This can be very reassuring to students/parents who will be happy to hear from their tutor, especially if it's their first booking with you!</p>
                <p>Please be prompt and kindly adhere to the policies regarding uniform, background, sound, and lighting.</p>
                <p>This booking will now appear on your dashboard.</p>
                <p>Tutors who receive positive reviews are always booked more often, so if it feels right and the lesson is as positive as we hope it will be, we ask you to courteously and professionally encourage students and parents to leave you a review.</p>
                <p>Thank you and enjoy your tutorial.</p>
                <div>
                    <img src="${settings?.brand_image}" alt="ESPD" style="max-width:250px;">
                </div>
                <div>
                    <a href="${process.env.WEBSITE_BASE_URL}" style="display:block; font-weight:bold;">Website</a>
                    <a href="${settings?.facebook}" style="display:block; font-weight:bold;">Facebook</a>
                    <a href="${settings?.instagram}" style="display:block; font-weight:bold;">Instagram</a>
                    <a href="${settings?.youtube}" style="display:block; font-weight:bold;">Youtube</a>
                    <a href="${settings?.tiktok}" style="display:block; font-weight:bold;">Tiktok</a>
                    <a href="${settings?.linkedin}" style="display:block; font-weight:bold;">Linkedin</a>
                </div>
            </div>
        `
        await this.emailService.sendEmail(booking?.Teacher?.email, 'ESPD - Booking Lessons ', "", teacher_html);
        await this.smsService.sendSMS(booking?.Teacher?.phone, `You have a new booking! Your tutorial will take place on ${booking?.start_time}. Please see your email notification for further details. Best wishes, The ESPD Team`);
        return booking
    }


}
